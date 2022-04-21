import dbConnection from '../config/mongoConnection';
import { ObjectId } from 'mongodb';
import data from '../data';
const appointments = data.appointments;
const reviews = data.reviews;

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

  console.log('Done seeding appointments in database');
  await reviews.create({
    posterId: new ObjectId().toString(),
    hairdresserId: new ObjectId().toString(),
    body: 'The service was excellent!',
    rating: 4.6,
  });

  console.log('Done seeding reviews in database');

  dbConnection.closeConnection();
}

main();
