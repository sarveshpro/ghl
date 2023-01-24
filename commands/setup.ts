// helper function to convert a firestore snapshot to event object
import * as admin from 'firebase-admin';
import serviceAaccount from '../src/config/serviceAccount.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAaccount as admin.ServiceAccount),
});

const db = admin.firestore();

// create a new collection called events
const events = db.collection('events');

// create a new event to intialize the collection
const createEventData = {
  startTime: admin.firestore.Timestamp.fromDate(new Date()),
  endTime: admin.firestore.Timestamp.fromDate(new Date()),
};

events.add(createEventData).then(() => {
  console.log('db initialized');
});
