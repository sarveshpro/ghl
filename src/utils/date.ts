import * as admin from 'firebase-admin';

// function to convert a firestore timestamp to ISO string
export const timestampToISOString = (timestamp: admin.firestore.Timestamp): string => {
  return timestamp.toDate().toISOString();
};

// function to convert a firestore timestamp to Date object
export const timestampToDate = (timestamp: admin.firestore.Timestamp): Date => {
  return timestamp.toDate();
};

// function to convert date to specified timezone
export const dateToTimezone = (date: Date, timezone: string): string => {
  return date.toLocaleString('en-US', { timeZone: timezone });
};

// function to convert date to specified timezone and return ISO string
export const dateToTimezoneISOString = (date: Date, timezone: string): string => {
  return new Date(dateToTimezone(date, timezone)).toISOString();
};

// function to convert date to ISO string
export const dateToISOString = (date: Date): string => {
  return date.toISOString();
};
