import { Appointment } from './types';
import { Review } from './types';
import { User } from './types';
import * as utils from './index';
import { stringify } from 'querystring';

/**
 *
 *
 * @param {string} customerId - ID of customer making appointment
 * @param {string} hairdresserId - ID of hairdresser for appointment
 * @param {number} startTime - Start time of appointment, as a POSIX timestamp
 * @param {number} endTime - End time of appointment, as a POSIX timestamp
 * @param {string} service - A keyword describing the service provided
 * @param {string|undefined} comments - Any comments or requests made in advance
 * @param {number} price - Price of any goods and services
 * @return {Appointment} A validated appointment
 */
export function validateAppointment(
  customerId: string,
  hairdresserId: string,
  startTime: number,
  endTime: number,
  service: string,
  comments: string | undefined,
  price: number
): Appointment {
  const cid = utils.checkId(customerId, 'customer'); // also check if ID is in database
  const hid = utils.checkId(hairdresserId, 'hairdresser'); // also check if ID is in database
  const std = utils.checkDate(startTime, 'start timestamp');
  const etd = utils.checkDate(endTime, 'end timestamp');
  const serv = utils.checkString(service, 'service');
  const comm = comments ? utils.checkString(comments, 'comments') : '';
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

/**
 *
 * @param {string} posterId - ID of poster making review
 * @param {string} hairdresserId - ID of hairdresser for review
 * @param {string} body - The text body of the review
 * @param {number} rating - The rating of the review
 * @return {Review} - A validated review
 */
export function validateReview(
  posterId: string,
  hairdresserId: string,
  body: string,
  rating: number
): Review {
  const pid = utils.checkId(posterId, 'poster');
  const hid = utils.checkId(hairdresserId, 'haidresser');
  const bdy = utils.checkString(body, 'body');
  const rtg = utils.checkNumber(rating, 1, 5, 'rating');

  const revw: Review = {
    posterId: pid,
    hairdresserId: hid,
    body: bdy,
    rating: rtg,
  };
  return revw;
}

export function validateUser(
	email: string,
	password: string,
	firstName: string,
	lastName: string,
	appointmentIds: Array<string>,
	reviewIds: Array<string>,
	level: string
): User { 
	const eml = utils.checkEmail(email, 'user email');
	const hpwd = utils.checkPassword(password);
	const fnm = utils.checkString(firstName, 'first name');
	const lnm = utils.checkString(lastName, 'last name');
	const aptids = appointmentIds.map(elem => utils.checkId(elem, 'appointment'));
	const rvwids = reviewIds.map(elem => utils.checkId(elem, 'review'));
	const lvl = utils.checkLevel(level);

	const usr: User = { 
		email: eml,
		password: hpwd,					// Note: This password is NOT hashed. It is hashed when it is stored in the DB.
		firstName: fnm,
		lastName: lnm,
		appointmentIds: aptids,
		reviewIds: rvwids,
		level: lvl
	}
	return usr;
}