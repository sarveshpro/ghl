import { NextFunction, Request, Response } from 'express';
import { CreateEventDto } from '@dtos/events.dto';
import eventService from '@services/events.service';
import { Event } from '@/interfaces/events.interface';
import { dateToISOString, dateToTimezoneISOString } from '@/utils/date';

class EventsController {
  public eventService = new eventService();

  public getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllEventsData: Event[] = await this.eventService.findAllEvent();

      // convert date to timezone from headers
      const timezone = req.headers.timezone as string;

      const modifiedEvents = findAllEventsData.map(event => {
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);
        const modifiedEvent = {
          ...event,
          startTime: timezone ? dateToTimezoneISOString(startTime, timezone) : dateToISOString(startTime),
          endTime: timezone ? dateToTimezoneISOString(endTime, timezone) : dateToISOString(endTime),
        };
        return modifiedEvent;
      });

      res.status(200).json({ data: modifiedEvents, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = req.params.id as string;
      const findOneEventData: Event = await this.eventService.findEventById(eventId);

      res.status(200).json({ data: findOneEventData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateEventDto = req.body;
      const createEventData: Event = await this.eventService.createEvent(userData);

      res.status(201).json({ data: createEventData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = req.params.id as string;
      const userData: CreateEventDto = req.body;
      const updateEventData: Event = await this.eventService.updateEvent(eventId, userData);

      res.status(200).json({ data: updateEventData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = req.params.id as string;
      const deleteEventData: Event = await this.eventService.deleteEvent(eventId);

      res.status(200).json({ data: deleteEventData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default EventsController;
