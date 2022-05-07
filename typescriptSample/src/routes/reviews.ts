import express = require('express');
const router: express.Router = new (express.Router as any)();
import data from '../data';
import * as utils from '../utils';
import xss from 'xss';
const reviews = data.reviews;
const users = data.users;
const appointments = data.appointments;

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
      relevantInformation = [
        ...new Map(relevantInformation.map((v) => [v.id, v])).values(),
      ];

      res.render('createreview', { hairdressers: relevantInformation });
    } else {
      res.redirect('/reviews');
    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post('/', async (req, res) => {
  try {
    const b = req.body;
    const revw = utils.validateReview(
      req.session.user,
      xss(b.hairdressersdrop),
      xss(b.body),
      Number(xss(b.reviewrating))
    );
    await reviews.create(revw);

    res.redirect('/reviews');
  } catch (e) {
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
    relevantInformation = [
      ...new Map(relevantInformation.map((v) => [v.id, v])).values(),
    ];

    res
      .status(400)
      .render('createreview', { hairdressers: relevantInformation, error: e });
  }
});

// Middleware to populate the list of hairdressers.
router.use('*', async (req, res, next) => {
  const foundReviews = await reviews.getAll();
  let allHairdressers = [];
  for (let i = 0; i < foundReviews.length; i++) {
    const foundHairdresser = await users.getById(foundReviews[i].hairdresserId);
    allHairdressers.push({
      name: foundHairdresser.firstName + ' ' + foundHairdresser.lastName,
      hid: foundHairdresser._id!,
    });
  }
  allHairdressers = [
    ...new Map(allHairdressers.map((v) => [v.hid, v])).values(),
  ];
  res.locals.partials.hairdressers = allHairdressers;
  next();
});

router.get('/', async (req, res) => {
  try {
    const foundReviews = await reviews.getAll();
    const relevantInformation = [];
    for (let i = 0; i < foundReviews.length; i++) {
      const foundCustomer = await users.getById(foundReviews[i].posterId);
      const foundHairdresser = await users.getById(
        foundReviews[i].hairdresserId
      );
      const customerName =
        foundCustomer.firstName + ' ' + foundCustomer.lastName;
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

    res.render('reviews', {
      reviews: relevantInformation,
      hairdressers: res.locals.partials.hairdressers,
      title: 'Reviews',
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get('/high-to-low', async (req, res) => {
  try {
    const foundReviews = await reviews.getAllReviewsSortedByRatingDesc();
    const relevantInformation = [];
    for (let i = 0; i < foundReviews.length; i++) {
      const foundCustomer = await users.getById(foundReviews[i].posterId);
      const foundHairdresser = await users.getById(
        foundReviews[i].hairdresserId
      );
      const customerName =
        foundCustomer.firstName + ' ' + foundCustomer.lastName;
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
    res.render('reviews', {
      reviews: relevantInformation,
      hairdressers: res.locals.partials.hairdressers,
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get('/low-to-high', async (req, res) => {
  try {
    const foundReviews = await reviews.getAllReviewsSortedByRatingAsc();
    const relevantInformation = [];
    for (let i = 0; i < foundReviews.length; i++) {
      const foundCustomer = await users.getById(foundReviews[i].posterId);
      const foundHairdresser = await users.getById(
        foundReviews[i].hairdresserId
      );
      const customerName =
        foundCustomer.firstName + ' ' + foundCustomer.lastName;
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
    res.render('reviews', {
      reviews: relevantInformation,
      hairdressers: res.locals.partials.hairdressers,
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post('/searchreviews', async (req, res) => {
  try {
    let searchReviewTerm = xss(req.body.searchReviewTerm);
    searchReviewTerm = utils.checkString(searchReviewTerm, 'searchReviewTerm');

    const foundReviews = await reviews.getReviewsBySearchTerm(searchReviewTerm);
    const relevantInformation = [];
    for (let i = 0; i < foundReviews.length; i++) {
      const foundCustomer = await users.getById(foundReviews[i].posterId);
      const foundHairdresser = await users.getById(
        foundReviews[i].hairdresserId
      );
      const customerName =
        foundCustomer.firstName + ' ' + foundCustomer.lastName;
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
    res.render('reviews', {
      reviews: relevantInformation,
      hairdressers: res.locals.partials.hairdressers,
    });
  } catch (e) {
    res.status(400).render('reviews', {
      hairdressers: res.locals.partials.hairdressers,
      error: e,
    });
  }
});

router.get('/userc/:cid', async (req, res) => {
  try {
    const _id = utils.checkId(xss(req.params.cid), 'customer id');
    const foundReviews = await reviews.getAllReviewsByCustomerId(_id);
    res.json(foundReviews);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get('/byhairdresser/', async (req, res) => {
  try {
    const foundReviews = await reviews.getAllReviewsByHairdresserId(
      xss(req.query.hairdressersdrop!.toString())
    );
    const relevantInformation = [];
    for (let i = 0; i < foundReviews.length; i++) {
      const foundCustomer = await users.getById(foundReviews[i].posterId);
      const foundHairdresser = await users.getById(
        foundReviews[i].hairdresserId
      );
      const customerName =
        foundCustomer.firstName + ' ' + foundCustomer.lastName;
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
    res.render('reviews', {
      reviews: relevantInformation,
      hairdressers: res.locals.partials.hairdressers,
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get('/userh/:hid', async (req, res) => {
  try {
    const _id = utils.checkId(xss(req.params.hid), 'hairdresser id');
    const foundReviews = await reviews.getAllReviewsByHairdresserId(_id);
    res.json(foundReviews);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const _id = utils.checkId(xss(req.params.id), 'review');
    const revw = await reviews.getById(_id);
    res.json(revw);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

export = router;
