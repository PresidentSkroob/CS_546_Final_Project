import { users } from '../config/mongoCollections';
import { ObjectId } from 'mongodb';
import * as utils from '../utils';
import { User } from '../utils';
import { Review } from '../utils';
import bcrypt from 'bcrypt'; // npm install --save @types/bcrypt

/**
 * Gets all users from the users collection
 *
 * @return {Promise<User<string>[]>} - A promise for the array of users
 */
async function getAll(): Promise<User<string>[]> {
  const userCollection = await users();
  const foundUsers = (await userCollection.find().toArray()) as Array<
    User<ObjectId | string>
  >;

  foundUsers.forEach((elem) => {
    elem._id = elem._id!.toString();
  });
  return foundUsers as User<string>[];
}
/**
 * Get a user with a given id
 *
 * @param {string} id - The id to look for
 * @return {Promise<User<string>>} - A promise for the found user
 */
async function getById(id: string): Promise<User<string>> {
  id = utils.checkId(id, 'user');
  const userCollection = await users();
  const foundUser = (await userCollection.findOne({
    _id: new ObjectId(id),
  })) as User<ObjectId | string>;
  if (!foundUser) throw `Error: no user found with id ${id}`;

  return utils.idToStr(foundUser) as User<string>;
}

/**
 * Creates a new user
 *
 * @param {User} user - User to add
 * @return {Promise<User<string>>} - A promise for the inserted user
 */
async function create(user: User): Promise<User<string>> {
  const userCollection = await users();
  const foundUser = (await userCollection.findOne({
    email: user.email,
  })) as User<ObjectId | string>;
  if (foundUser) throw `Error: user with email ${user.email} already exists`;

  const hashedPassword: string = await bcrypt.hash(user.password, 16);
  user.password = hashedPassword; // Replace the plaintext password with a hashed version.

  const newInsertInformation = await userCollection.insertOne(user);
  if (!newInsertInformation.insertedId || !newInsertInformation.acknowledged)
    throw `Error: User insertion failed!`;

  return getById(newInsertInformation.insertedId.toString());
}

/**
 * Checks if the received user exists in the database, and that the password is correct.
 *
 * @param {User} user - User to check
 * @return {Promise<User<string>>}- A promise for the found user.
 */
async function checkUser(user: User): Promise<User<string>> {
  const userCollection = await users();
  const foundUser = (await userCollection.findOne({
    email: user.email,
  })) as User<ObjectId | string>;

  if (!foundUser) throw `Error: either the username or password is invalid`;

  if (await bcrypt.compare(user.password, foundUser.password)) {
    return utils.idToStr(foundUser) as User<string>; // This return might not be necessary, but I kept it to stay consistent for now.
  }

  throw `Error: either the username or password is invalid`;
}

/**
 * Adds the _id of the given Review to its associated User with id posterId
 *
 * @param {Review} review - User to check
 * @return {Promise<User<string>>}- A promise for the updated User
 */
async function addReviewByUserId(review: Review<string | ObjectId>): Promise<User<string>> {

	const userCollection = await users();

	const updatedInformation = await userCollection.updateOne(
		{_id: new ObjectId(review.posterId)},
		{$push: {reviewIds: review._id!} });
	if (updatedInformation.modifiedCount === 0 || !updatedInformation.acknowledged) 
		throw `Error: Review addition to user failed`;

	return await getById(review.posterId);
}

export = {
  getById,
  create,
  getAll,
  checkUser, 
  addReviewByUserId
};
