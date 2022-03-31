import { MongoClient, Db } from 'mongodb';
import settings from './settings.json';
const mongoConfig = settings.mongoConfig;

let _connection: MongoClient;
let _db: Db;

export = {
  connectToDb: async () => {
    if (!_connection) {
      _connection = await MongoClient.connect(mongoConfig.serverUrl);
      _db = _connection.db(mongoConfig.database);
    }

    return _db;
  },
  closeConnection: () => {
    _connection.close();
  },
};
