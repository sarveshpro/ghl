import { NextFunction, Request, Response } from 'express';
import { DURATION } from '@/config';
import EventService from '@services/events.service';
import AvailabilityService from '@services/availability.service';
import { addDuration, isOverlapping, isValidDateRange, isValidTimezone, toServerTimezoneFromISOString } from '@/utils/date';
import { HttpException } from '@/exceptions/HttpException';

class AvailabilityController {
  public eventService = new EventService();
  public availabilityService = new AvailabilityService();

  public getAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get filters from query params
      const query = req.query;

      const startDate = toServerTimezoneFromISOString(query.startDate as string);
      const endDate = toServerTimezoneFromISOString(query.endDate as string);
      const duration = Number(query.duration);
      const timezone = query.timezone as string;

      if (!isValidDateRange(startDate, endDate)) {
        throw new HttpException(400, 'Invalid date range');
      }

      if (duration < 0 || duration > 120) {
        throw new HttpException(400, 'Invalid duration');
      }

      if (!isValidTimezone(timezone)) {
        throw new HttpException(400, 'Invalid timezone');
      }

      // get availability between given dates
      const availability = await this.availabilityService.findAvailabilityBetweenDates(startDate, endDate, duration);

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

      // convert slots to client timezone
      const clientTimezoneSlots = freeSlots.map(slot => slot.setZone(timezone));

      res.status(200).json({ data: clientTimezoneSlots, message: 'free slots' });
    } catch (error) {
      next(error);
    }
  };
}

export default AvailabilityController;
