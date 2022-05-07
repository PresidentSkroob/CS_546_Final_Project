import * as types from './types';
import { ObjectId } from 'mongodb';

export * from './validation';
export * from './types';

/**
 * Checks if string is empty, will error when given an empty string
 * @param {string} strVal - String to be checked
 * @param {string} varName - Name of strVal
 * @param {boolean} allowEmpty - Flag that allows empty strings
 * @return {string} strVal trimmed of all spaces
 */
export function checkString(
  strVal: string,
  varName: string,
  allowEmpty: boolean = false
): string {
  strVal = strVal.trim();
  if (!allowEmpty && strVal.length === 0) {
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  }
  return strVal;
}

/**
 * Checks if url matches a given regular expression
 * @param {string} url - The URL to be checked
 * @param {RegExp} regex - The regex to match against
 * @return {string} The unmodified URL
 */
export function checkURL(url: string, regex: RegExp): string {
  if (!regex.test(url)) {
    throw 'Provided website does not follow expected format. Expected: http://www.(5 characters).com';
  }
  return url;
}

/**
 * Checks if an Array of strings contains non-empty strings and trims each string
 * @param {Array<string>} arr - An array of strings to be checked
 * @param {string} contentName - What to call the contents of arr on an error
 * @return {Array<string>} The array of trimmed strings
 */
export function checkEachString(
  arr: Array<string>,
  contentName: string
): Array<string> {
  arr = arr.map((str, idx) =>
    checkString(str, `${contentName} ${idx}: ${str}`)
  );
  return arr;
}

/**
 * Checks if an integer is within a given range
 * @param {number} num - Number to be checked
 * @param {number} min - Lower bound of num
 * @param {number} max - Upper bound of num
 * @param {string} paramName - Name of num
 * @return {number} The unmodified num
 */
export function checkNumber(
  num: number,
  min: number,
  max: number,
  paramName: string
): number {
  if (isNaN(num) || num < min || num > max) {
    throw `parameter "${paramName}" is ill-formed (expected: number between ${min} and ${max})`;
  }
  return Number(num);
}

/**
 * Verifies that a given array has at least min elements
 * @param {Array<any>} array - The array to be checked
 * @param {number} min - The minimum size of array
 * @param {string} paramName - The name of array
 */
export function checkArraySize(
  array: Array<any>,
  min: number,
  paramName: string
) {
  if (array.length < min) {
    throw `Error: "${paramName}" array is too short`;
  }
}

/**
 * Converts a schema with a given _id to a schema with _id of type string
 *
 * @param {types.Schema<any>} obj - Object to convert
 * @return {types.Schema<string>} - Object with a string id
 */
export function idToStr(obj: types.Schema<any>): types.Schema<string> {
  if (!('_id' in obj)) {
    throw 'Error: object must have _id key to convert _id to string';
  }
  return { ...obj, _id: obj._id!.toString() };
}

/**
 * Trims an id string and checks if it is a valid mongo ObjectId
 *
 * @param {string} id - The id to check
 * @param {string} objName - The name of the object the ID is referring to
 * @return {string} - The trimmed id
 */
export function checkId(id: string, objName: string): string {
  id = id.trim();
  if (id.length === 0) {
    throw 'Error: id cannot be an empty string or just spaces';
  }
  if (!ObjectId.isValid(id)) throw `Error: invalid ${objName} ID`;

  return id;
}

/**
 * Checks that a given date string or timestamp is valid
 *
 * @param {string|number} date - The date string to check
 * @param {string} dateName - The name of date parameter
 * @return {Date} - The validated date
 */
export function checkDate(date: string | number, dateName: string): Date {
  const dt = new Date(date);
  if (dt.toString() == 'Invalid Date') {
    throw `Error: provided ${dateName} is invalid`;
  }
  return dt;
}
/**
 * Checks if a given email address is valid.
 *
 * @param {string} email - The email address to check
 * @param {string} emailName - The name of the email parameter
 * @return {string} - The validated email address
 */
export function checkEmail(email: string, emailName: string): string {
  email = checkString(email, 'email address');
  // This Regex is RFC 5322, sourced from http://emailregex.com/
  // It is a bit unwieldly, so some other implementation/location might be better.
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!reg.test(email)) {
    throw `Error: provided ${emailName} is invalid`;
  }
  return email;
}
/**
 * Checks if a given access level is valid (i.e. either 'user' or 'admin')
 *
 * @param {string} level - The access level to check
 * @return {string} - The validated level
 */
export function checkLevel(level: string): string {
  level = checkString(level, 'user level');
  if (level !== 'user' && level !== 'admin' && level !== 'hairdresser') {
    throw `Error: provided user level is invalid`;
  }
  return level;
}
/**
 * Checks if a given plain text password is valid (i.e. no spaces and minimum length)
 *
 * @param {string} password - The *unhashed* password to check
 * @param {number} minLength - The minimum length of the password, default 6.
 * @return {string} - The validated password
 */
export function checkPassword(password: string, minLength: number = 6) {
  password = checkString(password, 'user password');
  if (password.length < minLength) {
    throw `Error: password cannot be shorter than ${minLength} characters`;
  }
  if (password.indexOf(' ') >= 0) {
    throw `Error: password cannot contain spaces`;
  }
  return password;
}
/*
import moment from 'moment';


function checkDate(
  date: string,
  dateFormat: string,
  minDate: Date,
  maxDate: Date,
  dateName: string
) {
  date = checkString(date, dateName);
  const mDate = moment(date, dateFormat, true);
  if (!mDate.isValid()) {
    throw `Error: invalid ${dateName} provided "${date}", must follow "${dateFormat}" format`;
  }
  if (mDate.isBefore(minDate) || mDate.isAfter(maxDate)) {
    throw `Error: invalid ${dateName}, must be after ${minDate} and before ${maxDate}`;
  }
  return date;
}
*/
