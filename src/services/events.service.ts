import { CreateEventDto } from '@dtos/events.dto';
import { HttpException } from '@exceptions/HttpException';
import { Event, EventForFirestore } from '@interfaces/events.interface';
import eventModel from '@models/events.model';
import { isEmpty } from '@utils/util';
import Firebase, { snapshotToEvents } from '@/utils/firebase';

class EventService {
  public events = eventModel.getInstance().getEvents();

  public async findAllEvent(): Promise<Event[]> {
    const snapshot: FirebaseFirestore.QuerySnapshot = await this.events.get();
    const events: Event[] = snapshotToEvents(snapshot);

    if (isEmpty(events)) throw new HttpException(409, 'There are no events');

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
    const { Timestamp } = Firebase.getInstance().getFirebase().firestore;
    if (isEmpty(eventData)) throw new HttpException(400, 'eventData is empty');

    // events are stored in firebase as a collection of documents
    // each document is an event
    // each event has an id field
    // events have start and end times
    // events cannot be created if they overlap with existing events

    // get all events
    const events = await this.findAllEvent();

    // check if event overlaps with existing events
    const eventStart = new Date(eventData.time);
    // get event end time from event duration
    const eventEnd = new Date(eventStart.getTime() + eventData.duration * 60000);

    for (const event of events) {
      const existingEventStart = new Date(event.startTime);
      const existingEventEnd = new Date(event.endTime);
      if (eventStart < existingEventEnd && eventEnd > existingEventStart) {
        throw new HttpException(409, 'Event overlaps with existing event');
      }
    }

    // create event in firebase
    const createEventData: EventForFirestore = {
      startTime: Timestamp.fromDate(eventStart),
      endTime: Timestamp.fromDate(eventEnd),
      metaData: eventData.metaData,
    };

    const newEvent = await this.events.add(createEventData);
    const snapshot: FirebaseFirestore.QuerySnapshot = await this.events.where('id', '==', newEvent.id).get();
    const createdEvent: Event = snapshotToEvents(snapshot)[0];

    return createdEvent;
  }

  public async updateEvent(eventId: string, eventData: CreateEventDto): Promise<Event> {
    const { Timestamp } = Firebase.getInstance().getFirebase().firestore;
    if (isEmpty(eventData)) throw new HttpException(400, 'eventData is empty');

    // events are stored in firebase as a collection of documents
    // each document is an event
    // each event has an id field
    // events have start and end times
    // events cannot be updated if they overlap with existing events

    // get all events
    const events = await this.findAllEvent();

    // check if event overlaps with existing events
    const eventStart = new Date(eventData.time);
    // get event end time from event duration
    const eventEnd = new Date(eventStart.getTime() + eventData.duration * 60000);

    for (const event of events) {
      const existingEventStart = new Date(event.startTime);
      const existingEventEnd = new Date(event.endTime);
      if (eventStart < existingEventEnd && eventEnd > existingEventStart) {
        throw new HttpException(409, 'Event overlaps with existing event');
      }
    }

    // update event in firebase
    const updateEventData: EventForFirestore = {
      startTime: Timestamp.fromDate(eventStart),
      endTime: Timestamp.fromDate(eventEnd),
      ...eventData,
    };

    const findEvent: Event = await this.findEventById(eventId);
    if (!findEvent) throw new HttpException(409, "Event doesn't exist");

    await this.events.doc(eventId).set(updateEventData);
    const snapshot: FirebaseFirestore.QuerySnapshot = await this.events.where('id', '==', eventId).get();
    const updatedEvent: Event = snapshotToEvents(snapshot)[0];

    return updatedEvent;
  }

  public async deleteEvent(eventId: string): Promise<Event> {
    const findEvent: Event = await this.findEventById(eventId);
    if (!findEvent) throw new HttpException(409, "Event doesn't exist");

    await this.events.doc(eventId).delete();

    return findEvent;
  }
}

export default EventService;
