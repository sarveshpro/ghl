// import db reference from the class above and use it to return a reference to the events collection

import Firestore from '@/utils/firebase';
const db = Firestore.getInstance().getDb();

// class to return a reference to the events collection
class Events {
  private static instance: Events;
  private events: FirebaseFirestore.CollectionReference;

  private constructor() {
    this.events = db.collection('events');
  }

  public static getInstance(): Events {
    if (!Events.instance) {
      Events.instance = new Events();
    }
    return Events.instance;
  }

  public getEvents(): FirebaseFirestore.CollectionReference {
    return this.events;
  }
}

export default Events;
