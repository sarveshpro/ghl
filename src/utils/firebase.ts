// helper function to convert a firestore snapshot to event object
import * as admin from 'firebase-admin';
import { Event } from '@/interfaces/events.interface';
import serviceAaccount from '../config/serviceAccount.json';
import { timestampToDate } from './date';

class Firestore {
  private static instance: Firestore;
  private db: admin.firestore.Firestore;

  private constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAaccount as admin.ServiceAccount),
    });
    this.db = admin.firestore();
  }

  public static getInstance(): Firestore {
    if (!Firestore.instance) {
      Firestore.instance = new Firestore();
    }
    return Firestore.instance;
  }

  public getDb(): admin.firestore.Firestore {
    return this.db;
  }

  public getFirebase(): typeof admin {
    return admin;
  }
}

export default Firestore;

export const snapshotToEvents = (snapshot: admin.firestore.QuerySnapshot): Event[] => {
  const events: Event[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    const event: Event = {
      id: doc.id,
      ...data,
      // convert firestore timestamp to ISO string
      startTime: timestampToDate(data.startTime),
      endTime: timestampToDate(data.endTime),
    };
    events.push(event);
  });
  return events;
};
