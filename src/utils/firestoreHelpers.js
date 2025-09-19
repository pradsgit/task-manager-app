// generic helpers for collections and docs
import { collection, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const COLLECTIONS = {
  TASKS: 'tasks'
  // add more when required
};

// Generic helpers (scalable for future collections)
export const getCollection = (name) => collection(db, name);
export const getDocRef = (name, id) => doc(db, name, id);

// Task-specific helpers
export const getTasksCollection = () => getCollection(COLLECTIONS.TASKS);
export const getTaskDoc = (id) => getDocRef(COLLECTIONS.TASKS, id);

// export const createTaskData = (userId, title) => ({
//   userId,
//   title,
//   completed: false
// });