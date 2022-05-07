import { appointments } from '../config/mongoCollections';

import users from './users';

import { ObjectId } from 'mongodb';
import * as utils from '../utils';
import { Appointment } from '../utils';
const areIntervalsOverlapping = require('date-fns/areIntervalsOverlapping');
const isSameDay = require('date-fns/isSameDay');

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
  const foundAppointment = await get(
    newInsertInformation.insertedId.toString()
  );
  users.addAppointmentByUserId(foundAppointment);

  return get(newInsertInformation.insertedId.toString());
}

/**
 * Gets all appointments which have customerId cid
 *
 * @param {string} cid - The customer id to query by
 * @return {Promise<Appointment<string>[]>} - A promise for the appointments
 */
async function getAllApptsByCustomerId(
  cid: string
): Promise<Appointment<string>[]> {
  cid = utils.checkId(cid, 'customer');
  const appointmentCollection = await appointments();
  const foundAppointments = (await appointmentCollection
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
 * Gets all appointments which have customerId cid
 * Only difference: returns [] when empty
 * 
 * @param {string} cid - The customer id to query by
 * @return {Promise<Appointment<string>[]>} - A promise for the appointments
 */
 async function getAllApptsByCustomerId2(
  cid: string
): Promise<Appointment<string>[]> {
  cid = utils.checkId(cid, 'customer');
  const appointmentCollection = await appointments();
  const foundAppointments = (await appointmentCollection
    .find({
      customerId: cid,
    })
    .toArray()) as Appointment<ObjectId | string>[];
  if (!foundAppointments || foundAppointments.length === 0)
    return [];
  foundAppointments.forEach((elem) => {
    elem._id = elem._id!.toString();
  });
  return foundAppointments as Appointment<string>[];
}

/**
 * Gets all appointments which have hairdresserId hid
 *
 * @param {string} hid - The hairdresser id to query by
 * @return {Promise<Appointment<string>[]>} - A promise for the appointments
 */
async function getAllApptsByHairdresserId(
  hid: string
): Promise<Appointment<string>[]> {
  hid = utils.checkId(hid, 'hairdresser');
  const appointmentCollection = await appointments();
  const foundAppointments = (await appointmentCollection
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

/**
 * Gets all appointments which have hairdresserId hid
 * Only difference: returns [] when empty
 *
 * @param {string} hid - The hairdresser id to query by
 * @return {Promise<Appointment<string>[]>} - A promise for the appointments
 */
async function getAllApptsByHairdresserId2(
  hid: string
): Promise<Appointment<string>[]> {
  hid = utils.checkId(hid, 'hairdresser');
  const appointmentCollection = await appointments();
  const foundAppointments = (await appointmentCollection
    .find({
      hairdresserId: hid,
    })
    .toArray()) as Appointment<ObjectId | string>[];
  if (!foundAppointments || foundAppointments.length === 0)
    return [];
  foundAppointments.forEach((elem) => {
    elem._id = elem._id!.toString();
  });
  return foundAppointments as Appointment<string>[];
}

/**
 * Checks if an Appointment's stand and end time are not already tae
 * 
 * @param {Appointment} appt - The Appointment to check
 * @return {Object} - An object containing true if the given Appointment is valid. 
 */
async function checkAppointment(appt: Appointment) {
  const foundAppointments = await getAllApptsByHairdresserId(
    appt.hairdresserId
  );
  if (foundAppointments && foundAppointments.length !== 0) {
    for (let i = 0; i < foundAppointments.length; i++) {
      if (
        areIntervalsOverlapping(
          { start: new Date(appt.startTime), end: new Date(appt.endTime) },
          {
            start: new Date(foundAppointments[i].startTime),
            end: new Date(foundAppointments[i].endTime),
          }
        )
      ) {
        throw `Error: appointment time already taken!`;
      }
    }
  }
  return { valid: true };
}

/**
 * Given dateStr and an hairdresserId, check if an hour timeslot after dateStr is already 
 * taken. 
 * 
 * @param {string} dateStr - String representation of the datetime. 
 * @param {string} hid - The hairdresserId to query by. 
 * @return {Object} - Contains {valid: true} if the appointment can be added, false if not. 
 */
async function checkAppointmentByDateTimeAndHairdresser(dateStr: string, hid: string) { 
	dateStr = utils.checkDate(dateStr, 'appointment').toISOString();
	hid = utils.checkId(hid, 'hairdresser');
	const foundAppointments = await getAllApptsByHairdresserId(hid);	
	const newStart = new Date(dateStr);
	const newEnd = new Date(dateStr);
	newEnd.setMinutes(newStart.getMinutes() + 59);

	for(let i = 0; i < foundAppointments.length; i++) { 

		if( areIntervalsOverlapping(
			{ start: newStart, end: newEnd  }, 
			{ start: new Date(foundAppointments[i].startTime), end: new Date(foundAppointments[i].endTime )}, 
			// { inclusive: true } 
		)) {
			throw `Error: appointment time already taken!`;
			// return { valid: false };
		}
	}
	return { valid: true };

}

/**
 * Given a datetime, get all appointments on that day. 
 * 
 * @param {string} dateStr - String representation of the datetime
 * @return {Promise<Appointment<string>[]>} - A Promise of the Array of appointments. 
 */
async function getAllAppointmentsOnDay(dateStr: string): Promise<Appointment<string>[]> {
	const foundAppointments = await getAll();	
	const apptsOnDay = [];
	if(foundAppointments && foundAppointments.length !== 0) { 
		for(let i = 0; i < foundAppointments.length; i++) { 
			if( isSameDay( new Date(foundAppointments[i].startTime), new Date(dateStr) ) ) { 
				apptsOnDay.push(foundAppointments[i]);
			}
		}
	}

	return apptsOnDay as Appointment<string>[];
}


export = {
  get,
  create,
  getAll,
  getAllApptsByCustomerId,
  getAllApptsByCustomerId2,
  getAllApptsByHairdresserId,
  getAllApptsByHairdresserId2,
  checkAppointment,
  getAllAppointmentsOnDay,
  checkAppointmentByDateTimeAndHairdresser
};
