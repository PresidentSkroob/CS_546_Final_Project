import express = require('express');
const router: express.Router = new (express.Router as any)();
import data from '../data';
import * as utils from '../utils';
import xss from 'xss';
const appointments = data.appointments;
const reviews = data.reviews;
const users = data.users;

router.get('/', async (_req, res) => {
  try {
    const foundUsers = await users.getAll();
    res.json(foundUsers);
  } catch (e) {
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
        xss(b.lastName)
      );
      b.password = '';
      const status = await users.create(usr);
      usr.password = '';
      req.session.user = status._id!;
      return res.json({ authenticated: true });
    } catch (e) {
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
        const usrs = await users.getAll();
        const revws = await reviews.getAll();
        revws.forEach((e) => {
          const hd = usrs.filter((d) => d._id == e.hairdresserId)[0];
          e.hairdresserId = `${hd.firstName} ${hd.lastName}`;
          const p = usrs.filter((d) => d._id == e.posterId)[0];
          e.posterId = `${p.firstName} ${p.lastName}`;
          return e;
        });
        const appts = await appointments.getAll();

        appts.forEach((e) => {
          const hd = usrs.filter((d) => d._id == e.hairdresserId)[0];
          e.hairdresserId = `${hd.firstName} ${hd.lastName}`;
          const c = usrs.filter((d) => d._id == e.customerId)[0];
          e.customerId = `${c.firstName} ${c.lastName}`;
          e.stString = new Date(e.startTime).toLocaleString();
          e.etString = new Date(e.endTime).toLocaleString();
          return e;
        });

        return res.render('admin', {
          title: `Admin Portal`,
          users: usrs,
          appointments: appts,
          reviews: revws,
          levels: ['user', 'admin', 'hairdresser'],
          views: req.session.views,
        });
      } else {
        return res.status(403).render('error', {
          title: 'Insufficient Permissions',
          'error-msg':
            'You do not have sufficient permissions to access this resource.',
          'error-status': 403,
        });
      }
    } else {
      return res.redirect('/users/login');
    }
  } catch (e) {
    return res.status(500).render('error', {
      title: 'Server Error',
      'error-status': 500,
      'error-msg': e,
    });
  }
});

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      let _id = xss(req.params.id);
      try {
        _id = utils.checkId(_id, 'user');
      } catch (e) {
        return res.status(404).render('error', {
          title: 'Page Not Found',
          'error-msg': e,
          'error-status': 404,
        });
      }
      if (_id !== req.session.user) {
        return res.status(403).render('error', {
          title: 'Access Denied',
          'error-msg': "Users may not access other users' accounts.",
          'error-status': 403,
        });
      }
      const usr = await users.getById(_id);
      if (usr.level === 'user') {
        return res.render('user', {
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
        return res.render('user', {
          title: `${usr.firstName}'s Account`,
          user: {
            firstName: usr.firstName,
            lastName: usr.lastName,
            email: usr.email,
            appointments: await appointments.getAllApptsByHairdresserId(
              usr._id!
            ),
            reviews: await reviews.getAllReviewsByHairdresserId(usr._id!),
          },
        });
      }
    } catch (e) {
      return res.status(404).render('error', {
        title: 'Invalid User ID',
        'error-msg': e,
        'error-status': 404,
      });
    }
  })
  .patch(async (req, res) => {
    try {
      const _id = xss(req.params.id);
      const level = utils.checkLevel(xss(req.body.level));
      if (_id === req.session.user && level !== 'admin') {
        return res.status(400).json({
          error:
            'You cannot demote yourself. Please have someone else demote you.',
        });
      }
      const usr = await users.getById(req.session.user);
      if (usr.level !== 'admin') {
        return res
          .status(403)
          .json({ error: 'You must be an admin to change permission levels' });
      }
      const status = await users.updateLevel(_id, level);
      return res.status(200).json(status);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

export = router;
