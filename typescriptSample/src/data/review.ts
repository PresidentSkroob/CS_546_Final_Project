import { reviews } from '../config/mongoCollections';
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

  return getById(newInsertInformation.insertedId.toString());
}

export = {
  getById,
  create,
  getAll,
};
