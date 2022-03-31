import { MongoClient, Db } from 'mongodb';
import settings from './settings.json';
const mongoConfig = settings.mongoConfig;
require('dotenv').config();

let _connection: MongoClient;
let _db: Db;

export = {
  connectToDb: async () => {
    // main difference here is docker integration via dotenv
    let mongoURL = mongoConfig.serverUrl;
    if (process.env.DATABASE_HOST) {
      mongoURL = `mongodb://${process.env.DATABASE_HOST}:27017`;
    }
    if (!_connection) {
      _connection = await MongoClient.connect(mongoURL);
      _db = _connection.db(mongoConfig.database);
    }

    return _db;
  },
  closeConnection: () => {
    _connection.close();
  },
};
