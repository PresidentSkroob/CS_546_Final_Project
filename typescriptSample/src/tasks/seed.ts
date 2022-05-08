import dbConnection from '../config/mongoConnection';
import data from '../data';
const appointments = data.appointments;
const reviews = data.reviews;
const users = data.users;
const discounts = data.discounts;

/* eslint-disable */
/**
 * Seeds the database before running the main webserver
 */
async function main() {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  const usr1 = await users.create({
    email: 'johnsmith@gmail.com',
    password: 'supersecret',
    firstName: 'John',
    lastName: 'Smith',
    appointmentIds: [],
    reviewIds: [],
    job: '',
    biography: '',
    level: 'user',
  });

  const usr2 = await users.create({
    email: 'almacorvin@gmail.com',
    password: 'almacorvin22',
    firstName: 'Alma',
    lastName: 'Corvin',
    appointmentIds: [],
    reviewIds: [],
    job: '',
    biography: '',
    level: 'user',
  });

  const hrdsr1 = await users.create({
    email: 'alexandergomez@gmail.com',
    password: 'mypassword',
    firstName: 'Alexander',
    lastName: 'Gomez',
    appointmentIds: [],
    reviewIds: [],
    job: 'haircut',
    biography:
      "Alexander has been a salonist for over 15 years after graduating from Hill University with a Masters Degree in Hair Styling. She has been with us here at C'est La Vie since our founding in 2008.",
    level: 'hairdresser',
  });

  const hrdsr2 = await users.create({
    email: 'zachroho@gmail.com',
    password: 'thelettereight',
    firstName: 'Zachary',
    lastName: 'Rohovit',
    appointmentIds: [],
    reviewIds: [],
    job: 'coloring',
    biography:
      "Zachary, originally a Chemical Engineer from Stevens Institute of Technology, has developed an incredible hair-treatment formula that allows hair to be bleached and color without severely damaging it. This revolutionary product has elongated the health and lifespan of our customer's hair. He has been with us for 6 years, creating smiles and vibrant hairstyles.",
    level: 'hairdresser',
  });

  const admin = await users.create({
    email: 'phill@stevens.edu',
    password: 'password1234',
    firstName: 'Patrick',
    lastName: 'Hill',
    appointmentIds: [],
    reviewIds: [],
    job: '',
    biography: '',
    level: 'admin',
  });

  console.log('Done seeding users in database');

  const appt1 = await appointments.create({
    customerId: usr2._id!.toString(),
    hairdresserId: hrdsr1._id!.toString(),
    startTime: new Date('2022-05-12 12:00 EDT').getTime(), // 12 to 1
    endTime: new Date('2022-05-12 13:00 EDT').getTime(),
    service: 'coloronly',
    comments: 'My first time getting a coloring.',
    price: 45,
  });

  const appt2 = await appointments.create({
    customerId: usr1._id!.toString(),
    hairdresserId: hrdsr2._id!.toString(),
    startTime: new Date('2022-05-12 13:00 EDT').getTime(), // 1 to 2
    endTime: new Date('2022-05-12 14:00 EDT').getTime(),
    service: 'washandcut',
    comments: 'I would like to use size 2 clippers',
    price: 65,
  });

  const appt3 = await appointments.create({
    customerId: usr1._id!.toString(),
    hairdresserId: hrdsr1._id!.toString(),
    startTime: new Date('2022-05-12 14:00 EDT').getTime(), // 2 to 3
    endTime: new Date('2022-05-12 15:00 EDT').getTime(),
    service: 'cutandcolor',
    comments: 'Lets make it three colors.',
    price: 80,
  });

  const appt4 = await appointments.create({
    customerId: usr2._id!.toString(), // Second hairdresser
    hairdresserId: hrdsr2._id!.toString(),
    startTime: new Date('2022-05-12 15:00 EDT').getTime(), // 3 to 4
    endTime: new Date('2022-05-12 16:00 EDT').getTime(),
    service: 'washandcut',
    comments: 'Squared neckline please.',
    price: 65,
  });

  console.log('Done seeding appointments in database');

  const review1 = await reviews.create({
    posterId: usr2._id!.toString(),
    hairdresserId: hrdsr1._id!.toString(),
    // appointmentId: appt1._id!.toString(),
    body: 'I believe that the service was first-class!',
    rating: 4.6,
  });

  const review2 = await reviews.create({
    posterId: usr1._id!.toString(),
    hairdresserId: hrdsr2._id!.toString(),
    // appointmentId: appt2._id!.toString(),
    body: 'I disliked the cut from the second it started!',
    rating: 1.3,
  });

  const review3 = await reviews.create({
    posterId: usr1._id!.toString(),
    hairdresserId: hrdsr1._id!.toString(),
    // appointmentId: appt3._id!.toString(),
    body: 'This was my third time here, and I just had to leave a good review.',
    rating: 4.8,
  });

  console.log('Done seeding reviews in database');

  const disc1 = await discounts.create({
    name: 'welcome',
    amount: 20,
  });
  const disc2 = await discounts.create({
    name: 'take10',
    amount: 10,
  });
  console.log('Done seeding discounts in database');
  dbConnection.closeConnection();
}

main();
/* eslint-enable */
