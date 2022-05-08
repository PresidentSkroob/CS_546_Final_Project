import { discounts } from '../config/mongoCollections';

import users from './users';

import { ObjectId } from 'mongodb';
import * as utils from '../utils';

import { Discount } from '../utils';

/**
 * Gets all discount from the test collection
 *
 * @return {Promise<Discount<string>[]>} An array of discount
 */
 async function getAll(): Promise<Discount<string>[]> {
    const testCollection = await discounts();
    const testDisc = (await testCollection.find().toArray()) as Array<
    Discount<ObjectId | string>
    >;
  
    testDisc.forEach((elem) => {
      elem._id = elem._id!.toString();
    });
    return testDisc as Discount<string>[];
  }
  
/**
 * Get an discount with a given id
 *
 * @param {string} id - The id to look for
 * @return {Promise<Promise<string>>} - A promise for the discount
 */
async function get(id: string): Promise<Discount<string>> {
id = utils.checkId(id, 'discount');
const testCollection = await discounts();
const disc = (await testCollection.findOne({
    _id: new ObjectId(id),
})) as Discount<ObjectId | string>;

if (!disc) throw `Error: no discount found with id ${id}`;

return utils.idToStr(disc) as Discount<string>;
}


/**
 * Creates a new discount
 *
 * @param {Discount} disc - Discount to add
 * @return {Promise<Discount<string>>} - A promise of an discount
 */
 async function create(disc: Discount): Promise<Discount<string>> {
    const discountCollection = await discounts();
    const newInsertInformation = await discountCollection.insertOne(disc);
    if (!newInsertInformation.insertedId || !newInsertInformation.acknowledged)
      throw 'Error: Insert failed!';
    return get(newInsertInformation.insertedId.toString());
}


export = {
    get,
    create,
    getAll,
};