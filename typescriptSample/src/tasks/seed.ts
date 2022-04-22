import dbConnection from '../config/mongoConnection';
import { ObjectId } from 'mongodb';
import data from '../data';
import { getMaxListeners } from 'process';
const appointments = data.appointments;
const reviews = data.reviews;
const users = data.users;

/**
 * Seeds the database before running the main webserver
 *
 *
 * Note: Currently the seeded appointment and review are not added
 * John Smith's respective arrays. This will have to be done on the
 * backend.
 */
async function main() {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  let usr = await users.create({
    email: 'johnsmith@gmail.com',
    password: 'supersecret',
    firstName: 'John',
    lastName: 'Smith',
    appointmentIds: [],
    reviewIds: [],
    level: 'user',
  });

  let hrdsr = await users.create({
    email: 'alexandergomez@gmail.com',
    password: 'mypassword',
    firstName: 'Alexander',
    lastName: 'Gomez',
    appointmentIds: [],
    reviewIds: [],
    level: 'admin',
  });

  console.log('Done seeding users in database');

  const appt = await appointments.create({
    customerId: usr._id!.toString(),
    hairdresserId: hrdsr._id!.toString(),
    startTime: new Date('2022-03-12 12:00 EST').getTime(),
    endTime: new Date('2022-03-12 13:00 EST').getTime(),
    service: 'haircut',
    comments: '',
    price: 12.99,
  });

  console.log('Done seeding appointments in database');

  const review = await reviews.create({
    posterId: usr._id!.toString(),
    hairdresserId: hrdsr._id!.toString(),
    body: 'The service was excellent!',
    rating: 4.6,
  });

  console.log('Done seeding reviews in database');

  dbConnection.closeConnection();
}

main();
