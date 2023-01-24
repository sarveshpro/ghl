import { AVAILABILITY_END_TIME, AVAILABILITY_START_TIME, DURATION, TIMEZONE } from '@/config';
import * as admin from 'firebase-admin';
import { DateTime } from 'luxon';
import { RRule } from 'rrule';

// function to convert firebase timestamp to luxon datetime and server timezone
export const fromTimestampToServerTimezone = (timestamp: admin.firestore.Timestamp): DateTime => {
  return DateTime.fromMillis(timestamp.toMillis()).setZone(TIMEZONE);
};

export const toServerTimezone = (datetime: DateTime): DateTime => {
  return datetime.setZone(TIMEZONE);
};

// function to convert to specific timezone
export const toTimezone = (datetime: DateTime, timezone: string): DateTime => {
  return datetime.setZone(timezone);
};

// function to convert luxon datetime to firebase timestamp
export const toFirebaseTimestamp = (datetime: DateTime): admin.firestore.Timestamp => {
  return admin.firestore.Timestamp.fromMillis(datetime.toMillis());
};

// function to convert ISO string to luxon datetime and server timezone
export const toServerTimezoneFromISOString = (isoString: string): DateTime => {
  return DateTime.fromISO(isoString).setZone(TIMEZONE);
};

// function to add duration to luxon datetime
export const addDuration = (datetime: DateTime, duration: number): DateTime => {
  return datetime.plus({ minutes: duration });
};

// function to check if two events are overlapping
export const isOverlapping = (start1: DateTime, end1: DateTime, start2: DateTime, end2: DateTime): boolean => {
  return start1 < end2 && end1 > start2;
};

// function to convert to ISO string
export const toISOString = (datetime: DateTime, timezone?: string): string => {
  if (timezone) {
    return datetime.setZone(timezone).toISO();
  }
  return datetime.toISO();
};

// function to set hours
export const setHours = (datetime: DateTime, hours: number): DateTime => {
  return datetime.set({ hour: hours });
};

// get start and end of day from iso string
export const getStartAndEndOfDay = (isoString: string): { startOfDay: DateTime; endOfDay: DateTime } => {
  const datetime = DateTime.fromISO(isoString);
  const start = setHours(datetime, 0);
  const end = setHours(datetime, 24);
  return { startOfDay: start, endOfDay: end };
};

// get array of dates between two dates
export const getDatesBetween = (start: DateTime, end: DateTime): DateTime[] => {
  const dates = [];
  for (let dt = start; dt <= end; dt = dt.plus({ days: 1 })) {
    dates.push(dt);
  }
  return dates;
};

// get time slots using rrule between start and end hours
export const getTimeSlots = (date: DateTime): DateTime[] => {
  const startTime = setHours(date, Number(AVAILABILITY_START_TIME));
  const endTime = setHours(date, Number(AVAILABILITY_END_TIME));
  const rule = new RRule({
    freq: RRule.MINUTELY,
    interval: Number(DURATION),
    dtstart: startTime.toJSDate(),
    until: endTime.toJSDate(),
  });
  return rule.all().map(date => DateTime.fromJSDate(date));
};

// function to check if a date range is valid
export const isValidDateRange = (start: DateTime, end: DateTime): boolean => {
  return start < end;
};

// function to check if a date range falls within a date range
export const isWithinDateRange = (start: DateTime, end: DateTime, startRange: DateTime, endRange: DateTime): boolean => {
  return start >= startRange && end <= endRange;
};
