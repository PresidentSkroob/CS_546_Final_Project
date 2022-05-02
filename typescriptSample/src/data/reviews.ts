import { reviews } from '../config/mongoCollections';

import users from './users';

import { ObjectId } from 'mongodb';
import * as utils from '../utils';
import { Review } from '../utils';

/**
 * Gets all reviews from the reviews collection
 *
 * @return {Promise<Review<string>[]>} A promise for the array of reviews
 */
async function getAll(): Promise<Review<string>[]> {
  const reviewCollection = await reviews();
  const foundReviews = (await reviewCollection.find().toArray()) as Array<
    Review<ObjectId | string>
  >;

  foundReviews.forEach((elem) => {
    elem._id = elem._id!.toString();
  });
  return foundReviews as Review<string>[];
}

/**
 * Get a review with a given id
 *
 * @param {string} id - The id to look for
 * @return {Promise<Review<string>>} - A promise for the found review
 */
async function getById(id: string): Promise<Review<string>> {
  id = utils.checkId(id, 'review');
  const reviewCollection = await reviews();
  const foundReview = (await reviewCollection.findOne({
    _id: new ObjectId(id),
  })) as Review<ObjectId | string>;
  if (!foundReview) throw `Error: no review found with id ${id}`;

  return utils.idToStr(foundReview) as Review<string>;
}

/**
 * Creates a new review
 *
 * @param {Review} review - Review to add
 * @return {Promise<Review<string>>} - A promise for the inserted review
 */
async function create(review: Review): Promise<Review<string>> {
  const reviewCollection = await reviews();
  const newInsertInformation = await reviewCollection.insertOne(review);

  if (!newInsertInformation.insertedId || !newInsertInformation.acknowledged)
    throw `Error: Review insertion failed!`;
  let foundReview = (await getById(
    newInsertInformation.insertedId.toString()
  )) as Review<string>;
  await users.addReviewByUserId(foundReview);

  return getById(newInsertInformation.insertedId.toString());
}

/**
 * Gets all of the reviews and returns them sorted by rating
 *
 * @return {Promise<Review<string>[]>} - The reviews sorted by rating.
 */
async function getAllReviewsSortedByRatingDesc(): Promise<Review<string>[]> {
  const reviewCollection = await reviews();
  const foundReviews = (await reviewCollection
    .find()
    .sort({ rating: -1 })
    .toArray()) as Array<Review<ObjectId | string>>;

  foundReviews.forEach((elem) => {
    elem._id = elem._id!.toString();
  });
  return foundReviews as Review<string>[];
}

/**
 * Gets all of the reviews and returns them sorted by rating ascending
 *
 * @return {Promise<Review<string>[]>} - The reviews sorted by rating.
 */
 async function getAllReviewsSortedByRatingAsc(): Promise<Review<string>[]> {
	const reviewCollection = await reviews();
	const foundReviews = (await reviewCollection
	  .find()
	  .sort({ rating: 1 })
	  .toArray()) as Array<Review<ObjectId | string>>;
  
	foundReviews.forEach((elem) => {
	  elem._id = elem._id!.toString();
	});
	return foundReviews as Review<string>[];
  }

/**
 * Gets all reviews which have posterId cid
 *
 * @param cid - The customer/poster id to query by
 * @return {Promise<Review<string>[]>} - A promise for the reviews
 */
async function getAllReviewsByCustomerId(
  cid: string
): Promise<Review<string>[]> {
  cid = utils.checkId(cid, 'customer');
  const reviewCollection = await reviews();
  let foundReviews = (await reviewCollection
    .find({
      posterId: cid,
    })
    .toArray()) as Review<ObjectId | string>[];
  if (!foundReviews || foundReviews.length === 0)
    throw `Error: no review found with poster id ${cid}`;
  foundReviews.forEach((elem) => {
    elem._id = elem._id!.toString();
  });
  return foundReviews as Review<string>[];
}

/**
 * Gets all reviews which have hairdresserId hid
 *
 * @param hid - The hairdresser id to query by
 * @return {Promise<Review<string>[]>} - A promise for the reviews
 */
async function getAllReviewsByHairdresserId(
  hid: string
): Promise<Review<string>[]> {
  hid = utils.checkId(hid, 'hairdresser');
  const reviewCollection = await reviews();
  let foundReviews = (await reviewCollection
    .find({
      hairdresserId: hid,
    })
    .toArray()) as Review<ObjectId | string>[];
  if (!foundReviews || foundReviews.length === 0)
    throw `Error: no review found with hairdresser id ${hid}`;
  foundReviews.forEach((elem) => {
    elem._id = elem._id!.toString();
  });
  return foundReviews as Review<string>[];
}

async function getReviewsBySearchTerm(
	searchTerm: string
): Promise<Review<string>[]> { 
	searchTerm = utils.checkString(searchTerm, 'review search term');
	let regex = new RegExp(searchTerm, 'i');
	const reviewCollection = await reviews();
	let foundReviews = (await reviewCollection
		.find({
			body: { $regex: regex }
		}).toArray()) as Review<ObjectId | string>[];

	if(!foundReviews || foundReviews.length === 0)

	  throw `Error: no reviews found with term ${searchTerm}`;
	foundReviews.forEach((elem) => {
		elem._id = elem._id!.toString();
	});
	return foundReviews as Review<string>[];
}

export = {
  getById,
  create,
  getAll,
  getAllReviewsSortedByRatingDesc,
  getAllReviewsSortedByRatingAsc,
  getAllReviewsByCustomerId,
  getAllReviewsByHairdresserId,
  getReviewsBySearchTerm
};
