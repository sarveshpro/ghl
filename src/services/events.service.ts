import { CreateEventDto } from '@dtos/events.dto';
import { HttpException } from '@exceptions/HttpException';
import { Event, EventForFirestore } from '@interfaces/events.interface';
import eventModel from '@models/events.model';
import { isEmpty } from '@utils/util';
import { snapshotToEvents } from '@/utils/firebase';
import { addDuration, isOverlapping, toFirebaseTimestamp, toServerTimezoneFromISOString } from '@/utils/date';

class EventService {
  public events = eventModel.getInstance().getEvents();

  public async findAllEvent(filters: any): Promise<Event[]> {
    const { startDate, endDate } = filters;

    // firebase query
    let query = this.events;

    // if startDate is provided, query events that start after startDate
    if (startDate) {
      query = query.where('startTime', '>=', toFirebaseTimestamp(startDate));
    }

    // if endDate is provided, query events that start before endDate
    if (endDate) {
      query = query.where('startTime', '<=', toFirebaseTimestamp(endDate));
    }

    // get events from firebase
    const snapshot: FirebaseFirestore.QuerySnapshot = await query.get();
    const events: Event[] = snapshotToEvents(snapshot);

    // if (isEmpty(events)) throw new HttpException(409, 'There are no events');

    return events;
  }

  public async findEventById(eventId: string): Promise<Event> {
    // get event by id from firebase
    const snapshot: FirebaseFirestore.QuerySnapshot = await this.events.where('id', '==', eventId).get();
    const findEvent: Event = snapshotToEvents(snapshot)[0];
    if (!findEvent) throw new HttpException(409, "Event doesn't exist");

    return findEvent;
  }

  public async createEvent(eventData: CreateEventDto): Promise<Event> {
    if (isEmpty(eventData)) throw new HttpException(400, 'eventData is empty');

    // events are stored in firebase as a collection of documents
    // each document is an event
    // each event has an id field
    // events have start and end times
    // events cannot be created if they overlap with existing events

    // get all events
    const events = await this.findAllEvent({});

    // check if event overlaps with existing events
    // convert to server timezone
    const eventStart = toServerTimezoneFromISOString(eventData.time);
    // get event end time from event duration
    const eventEnd = addDuration(eventStart, eventData.duration);

    for (const event of events) {
      if (isOverlapping(eventStart, eventEnd, event.startTime, event.endTime)) {
        throw new HttpException(409, 'Event overlaps with existing event');
      }
    }

    // create event in firebase
    const createEventData: EventForFirestore = {
      startTime: toFirebaseTimestamp(eventStart),
      endTime: toFirebaseTimestamp(eventEnd),
      metaData: eventData.metaData,
    };

    const newEvent = await this.events.add(createEventData);
    const snapshot: FirebaseFirestore.QuerySnapshot = await this.events.where('id', '==', newEvent.id).get();
    const createdEvent: Event = snapshotToEvents(snapshot)[0];

    return createdEvent;
  }

  // public async updateEvent(eventId: string, eventData: CreateEventDto): Promise<Event> {
  //   const { Timestamp } = Firebase.getInstance().getFirebase().firestore;
  //   if (isEmpty(eventData)) throw new HttpException(400, 'eventData is empty');

  //   // events are stored in firebase as a collection of documents
  //   // each document is an event
  //   // each event has an id field
  //   // events have start and end times
  //   // events cannot be updated if they overlap with existing events

  //   // get all events
  //   const events = await this.findAllEvent({});

  //   // check if event overlaps with existing events
  //   const eventStart = new Date(eventData.time);
  //   // get event end time from event duration
  //   const eventEnd = new Date(eventStart.getTime() + eventData.duration * 60000);

  //   for (const event of events) {
  //     const existingEventStart = new Date(event.startTime);
  //     const existingEventEnd = new Date(event.endTime);
  //     if (eventStart < existingEventEnd && eventEnd > existingEventStart) {
  //       throw new HttpException(409, 'Event overlaps with existing event');
  //     }
  //   }

  //   // update event in firebase
  //   const updateEventData: EventForFirestore = {
  //     startTime: Timestamp.fromDate(eventStart),
  //     endTime: Timestamp.fromDate(eventEnd),
  //     ...eventData,
  //   };

  //   const findEvent: Event = await this.findEventById(eventId);
  //   if (!findEvent) throw new HttpException(409, "Event doesn't exist");

  //   await this.events.doc(eventId).set(updateEventData);
  //   const snapshot: FirebaseFirestore.QuerySnapshot = await this.events.where('id', '==', eventId).get();
  //   const updatedEvent: Event = snapshotToEvents(snapshot)[0];

  //   return updatedEvent;
  // }

  public async deleteEvent(eventId: string): Promise<Event> {
    const findEvent: Event = await this.findEventById(eventId);
    if (!findEvent) throw new HttpException(409, "Event doesn't exist");

    await this.events.doc(eventId).delete();

    return findEvent;
  }
}

export default EventService;
