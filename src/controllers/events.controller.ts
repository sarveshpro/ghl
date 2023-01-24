import { NextFunction, Request, Response } from 'express';
import { CreateEventDto } from '@dtos/events.dto';
import eventService from '@services/events.service';
import { Event } from '@/interfaces/events.interface';
import { toISOString, toServerTimezoneFromISOString } from '@/utils/date';
import { isEmpty } from '@/utils/util';
import { HttpException } from '@/exceptions/HttpException';

class EventsController {
  public eventService = new eventService();

  public getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get filters from query params
      const query = req.query;

      const filters = {
        startDate: isEmpty(query.startDate) ? undefined : toServerTimezoneFromISOString(query.startDate as string),
        endDate: isEmpty(query.endDate) ? undefined : toServerTimezoneFromISOString(query.endDate as string),
      };

      const findAllEventsData: Event[] = await this.eventService.findAllEvent(filters);

      if (isEmpty(findAllEventsData)) throw new HttpException(409, 'There are no events');

      // convert date to timezone from headers
      const timezone = req.headers.timezone as string;

      const modifiedEvents = findAllEventsData.map(event => {
        const modifiedEvent = {
          ...event,
          startTime: toISOString(event.startTime, timezone),
          endTime: toISOString(event.endTime, timezone),
        };
        return modifiedEvent;
      });

      res.status(200).json({ data: modifiedEvents, message: `${modifiedEvents.length} events found` });
    } catch (error) {
      next(error);
    }
  };

  public createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventData: CreateEventDto = req.body;
      const createEventData: Event = await this.eventService.createEvent(eventData);

      res.status(201).json({ data: createEventData, message: '1 event created' });
    } catch (error) {
      next(error);
    }
  };
}

export default EventsController;
