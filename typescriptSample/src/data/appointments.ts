import { appointments } from '../config/mongoCollections';

import users from './users';

import { ObjectId } from 'mongodb';
import * as utils from '../utils';
import { Appointment } from '../utils';

/**
 * Gets all appointments from the test collection
 *
 * @return {Promise<Appointment<string>[]>} An array of appointments
 */
async function getAll(): Promise<Appointment<string>[]> {
  const testCollection = await appointments();
  const testAppts = (await testCollection.find().toArray()) as Array<
    Appointment<ObjectId | string>
  >;

  testAppts.forEach((elem) => {
    elem._id = elem._id!.toString();
  });
  return testAppts as Appointment<string>[];
}

/**
 * Get an appointment with a given id
 *
 * @param {string} id - The id to look for
 * @return {Promise<Appointment<string>>} - A promise for the appointment
 */
async function get(id: string): Promise<Appointment<string>> {
  id = utils.checkId(id, 'appointment');
  const testCollection = await appointments();
  const appt = (await testCollection.findOne({
    _id: new ObjectId(id),
  })) as Appointment<ObjectId | string>;

  if (!appt) throw `Error: no appointment found with id ${id}`;

  return utils.idToStr(appt) as Appointment<string>;
}

/**
 * Creates a new appointment
 *
 * @param {Appointment} appt - Appointment to add
 * @return {Promise<Appointment<string>>} - A promise of an appointment
 */
async function create(appt: Appointment): Promise<Appointment<string>> {
  const appointmentCollection = await appointments();
  const newInsertInformation = await appointmentCollection.insertOne(appt);
  if (!newInsertInformation.insertedId || !newInsertInformation.acknowledged)
    throw 'Error: Insert failed!';
  let foundAppointment = (await get(
    newInsertInformation.insertedId.toString()
  )) as Appointment<string>;
  users.addAppointmentByUserId(foundAppointment);

  return get(newInsertInformation.insertedId.toString());
}

/**
 * Gets all appointments which have customerId cid
 *
 * @param cid - The customer id to query by
 * @return {Promise<Appointment<string>[]>} - A promise for the appointments
 */
async function getAllApptsByCustomerId(
  cid: string
): Promise<Appointment<string>[]> {
  cid = utils.checkId(cid, 'customer');
  const appointmentCollection = await appointments();
  let foundAppointments = (await appointmentCollection
    .find({
      customerId: cid,
    })
    .toArray()) as Appointment<ObjectId | string>[];
  if (!foundAppointments || foundAppointments.length === 0)
    throw `Error: no appointment found with customer id ${cid}`;
  foundAppointments.forEach((elem) => {
    elem._id = elem._id!.toString();
  });
  return foundAppointments as Appointment<string>[];
}

/**
 * Gets all appointments which have hairdresserId hid
 *
 * @param hid - The hairdresser id to query by
 * @return {Promise<Appointment<string>[]>} - A promise for the appointments
 */
async function getAllApptsByHairdresserId(
  hid: string
): Promise<Appointment<string>[]> {
  hid = utils.checkId(hid, 'hairdresser');
  const appointmentCollection = await appointments();
  let foundAppointments = (await appointmentCollection
    .find({
      hairdresserId: hid,
    })
    .toArray()) as Appointment<ObjectId | string>[];
  if (!foundAppointments || foundAppointments.length === 0)
    throw `Error: no appointment found with hairdresser id ${hid}`;
  foundAppointments.forEach((elem) => {
    elem._id = elem._id!.toString();
  });
  return foundAppointments as Appointment<string>[];
}

export = {
  get,
  create,
  getAll,
  getAllApptsByCustomerId,
  getAllApptsByHairdresserId,
};
