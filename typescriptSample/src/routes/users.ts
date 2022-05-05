import express = require('express');
const router: express.Router = new (express.Router as any)();
import data from '../data';
import * as utils from '../utils';
import xss from 'xss';
const appointments = data.appointments;
const reviews = data.reviews;
const users = data.users;

// Note: these routes do not yet consider any form of authentication.
// They merely exist to start us off.

router.get('/', async (_req, res) => {
  try {
    const foundUsers = await users.getAll();
    res.json(foundUsers);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router
  .route('/login')
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        return res.redirect('/');
      } else {
        return res.render('login', { title: 'Login' });
      }
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    try {
      const user = utils.validateLoginAttempt(
        xss(req.body.email),
        xss(req.body.password)
      );
      req.body.password = '';
      const status = await users.checkUser(user);
      user.password = '';
      req.session.user = status._id!;
      return res.json({ authenticated: true });
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });

router
  .route('/signup')
  .get(async (_req, res) => {
    try {
      res.render('signup', { title: 'Signup' });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    try {
      const b = req.body;
      const usr = utils.validateUser(
        xss(b.email),
        xss(b.password),
        xss(b.firstName),
        xss(b.lastName),
      );
      b.password = '';
      const status = await users.create(usr);
      usr.password = '';
      req.session.user = status._id!;
      return res.json({ authenticated: true });
    } catch (e) {
      console.log(e);
      res.status(404).json({ error: e });
    }
  });

router.route('/logout').get((req, res) => {
  try {
    req.session.user = '';
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.route('/private').get(async (req, res) => {
  try {
    if (req.session.user) {
      const usr = await users.getById(req.session.user);
      if (usr.level === 'admin') {
        res.render('admin', { title: `Admin Portal` });
      } else {
        res.status(403).render('error', {
          title: 'Insufficient Permissions',
          'error-msg':
            'You do not have sufficient permissions to access this resource.',
          'error-status': 403,
        });
      }
    } else {
      res.redirect('/users/login');
    }
  } catch (e) {
    res.status(500).render('error', {
      title: 'Server Error',
      'error-status': 500,
      'error-msg': e,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let _id = xss(req.params.id);
    try {
      _id = utils.checkId(_id, 'user');
    } catch (e) {
      res.status(404).render('error', {
        title: 'Page Not Found',
        'error-msg': e,
        'error-status': 404,
      });
    }
    const usr = await users.getById(_id);
    if (usr.level === 'user') {
      res.render('user', {
        title: `${usr.firstName}'s Account`,
        user: {
          firstName: usr.firstName,
          lastName: usr.lastName,
          email: usr.email,
          appointments: await appointments.getAllApptsByCustomerId(usr._id!),
          reviews: await reviews.getAllReviewsByCustomerId(usr._id!),
        },
      });
    } else {
      res.render('user', {
        title: `${usr.firstName}'s Account`,
        user: {
          firstName: usr.firstName,
          lastName: usr.lastName,
          email: usr.email,
          appointments: await appointments.getAllApptsByHairdresserId(usr._id!),
          reviews: await reviews.getAllReviewsByHairdresserId(usr._id!),
        },
      });

    }
  } catch (e) {
    res.status(404).render('error', {
      title: 'Invalid User ID',
      'error-msg': e,
      'error-status': 404,
    });
  }
});
// router.post('/login', async (req, res) => {
// 	try {
// 		const b = req.body;
// 		console.log(b.email, b.password, b.firstName, b.lastName,
// 			b.appointmentIds, b.reviewIds, b.level);

// 		const usr = utils.validateUser(
// 			b.email,
// 			b.password,
// 			b.firstName,
// 			b.lastName,
// 			b.appointmentIds,
// 			b.reviewIds,
// 			b.level
// 		);
// 		const checkUser = await users.checkUser(usr);
// 		if(checkUser) { 		// If the user already exists
// 			res.json(checkUser);
// 		}

// 	} catch (e) {
// 		console.log(e);
// 		res.status(404).json({error: e});
// 	}
// });

// router.get('/logout', async(req, res) => {
// 	// req.session.destroy();
// 	res.json({message: "you logged out son"});
// });

export = router;
