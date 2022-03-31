import dbConnection from '../config/mongoConnection';
import { ObjectId } from 'mongodb';
import data from '../data';
const appointments = data.appointments;

/**
 * Seeds the database before running the main webserver
 *
 */
async function main() {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  await appointments.create({
    customerId: new ObjectId().toString(),
    hairdresserId: new ObjectId().toString(),
    startTime: new Date('2022-03-12 12:00 EST').getTime(),
    endTime: new Date('2022-03-12 13:00 EST').getTime(),
    service: 'haircut',
    comments: '',
    price: 12.99,
  });

  console.log('Done seeding database');

  dbConnection.closeConnection();
}

main();
