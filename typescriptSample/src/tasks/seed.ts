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

  const appt1 = await appointments.create({
    customerId: usr._id!.toString(),
    hairdresserId: hrdsr._id!.toString(),
    startTime: new Date('2022-03-12 12:00 EST').getTime(),
    endTime: new Date('2022-03-12 13:00 EST').getTime(),
    service: 'haircut',
    comments: 'First appointment',
    price: 12.99,
  });

  const appt2 = await appointments.create({
    customerId: usr._id!.toString(),
    hairdresserId: hrdsr._id!.toString(),
    startTime: new Date('2022-03-12 13:00 EST').getTime(),
    endTime: new Date('2022-03-12 14:00 EST').getTime(),
    service: 'haircut',
    comments: 'Second appointment',
    price: 14.99,
  });

  const appt3 = await appointments.create({
    customerId: usr._id!.toString(),
    hairdresserId: hrdsr._id!.toString(),
    startTime: new Date('2022-03-12 14:00 EST').getTime(),
    endTime: new Date('2022-03-12 15:00 EST').getTime(),
    service: 'haircut',
    comments: 'Third appointment',
    price: 14.99,
  });

  console.log('Done seeding appointments in database');

  const review1 = await reviews.create({
    posterId: usr._id!.toString(),
    hairdresserId: hrdsr._id!.toString(),
    //appointmentId: appt1._id!.toString(),
    body: 'First review',
    rating: 4.6,
  });

  const review2 = await reviews.create({
    posterId: usr._id!.toString(),
    hairdresserId: hrdsr._id!.toString(),
    //appointmentId: appt2._id!.toString(),
    body: 'Second review',
    rating: 1.3,
  });

  const review3 = await reviews.create({
    posterId: usr._id!.toString(),
    hairdresserId: hrdsr._id!.toString(),
    //appointmentId: appt3._id!.toString(),
    body: 'third review',
    rating: 4.8,
  });

  console.log('Done seeding reviews in database');

  dbConnection.closeConnection();
}

main();
