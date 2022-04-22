import { Collection } from 'mongodb';
import dbConnection from './mongoConnection';

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = (collection: string) => {
  let _col: Collection;

  return async () => {
    if (!_col) {
      const db = await dbConnection.connectToDb();
      _col = db.collection(collection);
    }

    return _col;
  };
};

export const appointments = getCollectionFn('test');
export const reviews = getCollectionFn('reviews');
export const users = getCollectionFn('users');
