import { HttpException } from '@/exceptions/HttpException';
import { getDatesBetween, getTimeSlots } from '@/utils/date';
import { isEmpty } from '@/utils/util';
import { DateTime } from 'luxon';

class AvailabiltyService {
  public async findAvailabilityBetweenDates(startDate: DateTime, endDate: DateTime): Promise<DateTime[]> {
    const dateArray = getDatesBetween(startDate, endDate);
    if (isEmpty(dateArray)) throw new HttpException(409, 'There are no available slots between the dates provided');

    // get slots for each date and add to slots array
    const allSlots: DateTime[] = [];
    dateArray.forEach(date => {
      const slots = getTimeSlots(date);
      allSlots.push(...slots);
    });

    const requestedSlots = allSlots.filter(slot => {
      if (slot >= startDate && slot <= endDate) {
        return true;
      }
      return false;
    });

    return requestedSlots;
  }
}

export default AvailabiltyService;
