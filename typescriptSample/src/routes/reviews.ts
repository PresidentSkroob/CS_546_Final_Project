import express = require('express');
const router: express.Router = new (express.Router as any)();
import data from '../data';
import * as utils from '../utils';
const reviews = data.reviews;

router.get('/', async (req, res) => {
  try {
    const foundReviews = await reviews.getAll();
    res.json(foundReviews);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.post('/', async (req, res) => {
  try {
    const b = req.body;
    console.log(b.posterId, b.hairdresserId, b.body, b.rating);
    const revw = utils.validateReview(
      b.posterId,
	  b.hairdresserId,
      b.appointmentId,
      b.body,
      b.rating
    );
    res.json(await reviews.create(revw));
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.get('/byRating', async (req, res) => {
	try {
		const foundReviews = await reviews.getAllReviewsSortedByRatingDesc();
		res.json(foundReviews);
	  } catch (e) {
		console.log(e);
		res.status(404).json({ error: e });
	  }
});

router.get('/userc/:cid', async (req, res) => { 
	try { 
		const _id = utils.checkId(req.params.cid, 'customer id');
		const foundReviews = await reviews.getAllReviewsByCustomerId(_id);
		res.json(foundReviews);
	} catch (e) { 
		console.log(e);
		res.status(404).json({ error: e });
	}
});

router.get('/userh/:hid', async (req, res) => { 
	try { 
		const _id = utils.checkId(req.params.hid, 'hairdresser id');
		const foundReviews = await reviews.getAllReviewsByHairdresserId(_id);
		res.json(foundReviews);
	} catch (e) { 
		console.log(e);
		res.status(404).json({ error: e });
	}
});


router.get('/:id', async (req, res) => {
  try {
    const _id = utils.checkId(req.params.id, 'review');
    const revw = await reviews.getById(_id);
    res.json(revw);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

export = router;
