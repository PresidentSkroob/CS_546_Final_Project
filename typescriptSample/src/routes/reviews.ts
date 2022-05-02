import express = require('express');
const router: express.Router = new (express.Router as any)();
import data from '../data';
import * as utils from '../utils';
const reviews = data.reviews;
const users = data.users;
const appointments = data.appointments;

router.get('/', async (req, res) => {
  try {
    const foundReviews = await reviews.getAll();
    const relevantInformation = [];

    for (let i = 0; i < foundReviews.length; i++) {
      const foundCustomer = await users.getById(foundReviews[i].posterId);
      const foundHairdresser = await users.getById(foundReviews[i].hairdresserId);
      const customerName = foundCustomer.firstName + ' ' + foundCustomer.lastName;
      const hairdresserName =
        foundHairdresser.firstName + ' ' + foundHairdresser.lastName;
      const cur = {
        customerName: customerName,
        hairdresserName: hairdresserName,
        rating: foundReviews[i].rating,
        body: foundReviews[i].body,
      };
      relevantInformation.push(cur);
    }
    res.render('reviews', { reviews: relevantInformation });
    // res.json(foundReviews);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.get('/create', async (req, res) => {
  try {
    if (req.session.user) {
      const foundAppointments = await appointments.getAllApptsByCustomerId(
        req.session.user
      );
      let relevantInformation = [];
      for (let i = 0; i < foundAppointments.length; i++) {
        const foundHairdresser = await users.getById(
          foundAppointments[i].hairdresserId
        );
        if (relevantInformation)
          relevantInformation.push({
            name: foundHairdresser.firstName + ' ' + foundHairdresser.lastName,
            id: foundHairdresser._id!,
          });
      }
      // relevantInformation = [...new Set(relevantInformation)];
      relevantInformation = [
        ...new Map(relevantInformation.map((v) => [v.id, v])).values(),
      ];

      res.render('createreview', { hairdressers: relevantInformation });
    } else {
      res.redirect('/reviews');
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.post('/', async (req, res) => {
  try {
    const b = req.body;
    console.log(req.session.user, b.hairdressersdrop, b.body, b.reviewrating);
    const revw = utils.validateReview(
      req.session.user,
      b.hairdressersdrop,
      b.body,
      b.reviewrating
    );
    // const revw = utils.validateReview(
    //   b.posterId,
    //   b.hairdresserId,
    //   //b.appointmentId,
    //   b.body,
    //   b.rating
    // );
    await reviews.create(revw);
    res.redirect('/reviews');
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.get('/high-to-low', async (req, res) => {
  try {
    const foundReviews = await reviews.getAllReviewsSortedByRatingDesc();
    const relevantInformation = [];
    for (let i = 0; i < foundReviews.length; i++) {
      const foundCustomer = await users.getById(foundReviews[i].posterId);
      const foundHairdresser = await users.getById(foundReviews[i].hairdresserId);
      const customerName = foundCustomer.firstName + ' ' + foundCustomer.lastName;
      const hairdresserName =
        foundHairdresser.firstName + ' ' + foundHairdresser.lastName;
      const cur = {
        customerName: customerName,
        hairdresserName: hairdresserName,
        rating: foundReviews[i].rating,
        body: foundReviews[i].body,
      };
      relevantInformation.push(cur);
    }
    res.render('reviews', { reviews: relevantInformation });
    // res.json(foundReviews);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.get('/low-to-high', async (req, res) => {
  try {
    const foundReviews = await reviews.getAllReviewsSortedByRatingAsc();
    const relevantInformation = [];
    for (let i = 0; i < foundReviews.length; i++) {
      const foundCustomer = await users.getById(foundReviews[i].posterId);
      const foundHairdresser = await users.getById(foundReviews[i].hairdresserId);
      const customerName = foundCustomer.firstName + ' ' + foundCustomer.lastName;
      const hairdresserName =
        foundHairdresser.firstName + ' ' + foundHairdresser.lastName;
      const cur = {
        customerName: customerName,
        hairdresserName: hairdresserName,
        rating: foundReviews[i].rating,
        body: foundReviews[i].body,
      };
      relevantInformation.push(cur);
    }
    res.render('reviews', { reviews: relevantInformation });
    // res.json(foundReviews);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.post('/searchreviews', async (req, res) => {
  try {
    let searchReviewTerm = req.body.searchReviewTerm;
    searchReviewTerm = utils.checkString(searchReviewTerm, 'searchReviewTerm');

    const foundReviews = await reviews.getReviewsBySearchTerm(searchReviewTerm);
    const relevantInformation = [];
    for (let i = 0; i < foundReviews.length; i++) {
      const foundCustomer = await users.getById(foundReviews[i].posterId);
      const foundHairdresser = await users.getById(foundReviews[i].hairdresserId);
      const customerName = foundCustomer.firstName + ' ' + foundCustomer.lastName;
      const hairdresserName =
        foundHairdresser.firstName + ' ' + foundHairdresser.lastName;
      const cur = {
        customerName: customerName,
        hairdresserName: hairdresserName,
        rating: foundReviews[i].rating,
        body: foundReviews[i].body,
      };
      relevantInformation.push(cur);
    }
    res.render('reviews', { reviews: relevantInformation });
  } catch (e) {
    console.log(e);
    res.status(400).render('reviews', { error: e });
    // res.status(404).json({ error: e });
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
