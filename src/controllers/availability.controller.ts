import { NextFunction, Request, Response } from 'express';
import { DURATION } from '@/config';
import EventService from '@services/events.service';
import AvailabilityService from '@services/availability.service';
import { addDuration, isOverlapping, toServerTimezoneFromISOString } from '@/utils/date';

class AvailabilityController {
  public eventService = new EventService();
  public availabilityService = new AvailabilityService();

  public getAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get filters from query params
      const query = req.query;

      const startDate = toServerTimezoneFromISOString(query.startDate as string);
      const endDate = toServerTimezoneFromISOString(query.endDate as string);

      // get availability between given dates
      const availability = await this.availabilityService.findAvailabilityBetweenDates(startDate, endDate);

      // get events from db
      const events = await this.eventService.findAllEvent({});

      // check if any event overlaps with slots
      const freeSlots = availability.filter(slot => {
        const isSlotFree = events.every(event => {
          const slotEndTime = addDuration(slot, Number(DURATION));
          // console.log(eventStartTime, eventEndTime, slotStartTime, slotEndTime);
          return !isOverlapping(event.startTime, event.endTime, slot, slotEndTime);
        });
        return isSlotFree;
      });

      res.status(200).json({ data: freeSlots, message: 'free slots' });
    } catch (error) {
      next(error);
    }
  };
}

export default AvailabilityController;
