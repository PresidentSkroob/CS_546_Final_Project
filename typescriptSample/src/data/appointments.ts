import { appointments } from '../config/mongoCollections';
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
  const testCollection = await appointments();

  const newInsertInformation = await testCollection.insertOne(appt);
  if (!newInsertInformation.insertedId || !newInsertInformation.acknowledged)
    throw 'Error: Insert failed!';

  return get(newInsertInformation.insertedId.toString());
}

export = {
  get,
  create,
  getAll,
};
