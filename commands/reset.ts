// helper function to convert a firestore snapshot to event object
import * as admin from 'firebase-admin';
import serviceAaccount from '../src/config/serviceAccount.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAaccount as admin.ServiceAccount),
});

const db = admin.firestore();
const events = db.collection('events');

// delete all events
events.get().then(snapshot => {
  snapshot.forEach(doc => {
    doc.ref.delete();
  });
  console.log('done');
});
