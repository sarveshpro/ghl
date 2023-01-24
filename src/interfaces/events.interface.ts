import { DateTime } from 'luxon';

export interface Event {
  id: string;
  startTime: DateTime;
  endTime: DateTime;
  metaData?: EventMetaData;
}

export interface EventMetaData {
  firstName: string;
  lastName?: string;
  email: string;
}

export interface EventForFirestore {
  startTime: FirebaseFirestore.Timestamp;
  endTime: FirebaseFirestore.Timestamp;
  metaData?: EventMetaData;
}

export interface EventForApiResponse {
  id: string;
  startTime: string;
  endTime: string;
  metaData?: EventMetaData;
}
