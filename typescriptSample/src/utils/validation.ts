import { Appointment } from './types';
import * as utils from './index';

/**
 *
 *
 * @param {string} customerId - ID of customer making appointment
 * @param {string} hairdresserId - ID of hairdresser for appointment
 * @param {number} startTime - Start time of appointment, as a POSIX timestamp
 * @param {number} endTime - End time of appointment, as a POSIX timestamp
 * @param {string} service - A keyword describing the service provided
 * @param {string} comments - Any comments or requests made in advance
 * @param {number} price - Price of any goods and services
 * @return {Appointment} A validated appointment
 */
export function validateAppointment(
  customerId: string,
  hairdresserId: string,
  startTime: number,
  endTime: number,
  service: string,
  comments: string,
  price: number
): Appointment {
  const cid = utils.checkId(customerId, 'customer'); // also check if ID is in database
  const hid = utils.checkId(hairdresserId, 'hairdresser'); // also check if ID is in database
  const std = utils.checkDate(startTime, 'start timestamp');
  const etd = utils.checkDate(endTime, 'end timestamp');
  const serv = utils.checkString(service, 'service');
  const comm = utils.checkString(comments, 'comments', true);
  const pric = utils.checkNumber(price, NaN, NaN, 'price');

  const appt: Appointment = {
    customerId: cid,
    hairdresserId: hid,
    startTime: std.getTime(),
    endTime: etd.getTime(),
    service: serv,
    comments: comm,
    price: pric,
  };

  return appt;
}
