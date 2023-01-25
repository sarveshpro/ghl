import { HttpException } from '@/exceptions/HttpException';
import { getTimeSlots, isDateRangeinAvailability } from '@/utils/date';
import { isEmpty } from '@/utils/util';
import { DateTime } from 'luxon';

class AvailabiltyService {
  public async findAvailabilityBetweenDates(startDate: DateTime, endDate: DateTime, duration: number): Promise<DateTime[]> {
    // get slots between start and end dates
    const allSlots = getTimeSlots(startDate, endDate, duration);

    // check if slots are in availability
    const requestedSlots = allSlots.filter(slot => {
      const startDate = slot;
      const endDate = slot.plus({ minutes: duration });
      if (isDateRangeinAvailability(startDate, endDate)) {
        return true;
      }
      return false;
    });

    if (isEmpty(requestedSlots)) throw new HttpException(404, 'There are no available slots between the dates provided');

    return requestedSlots;
  }
}

export default AvailabiltyService;
