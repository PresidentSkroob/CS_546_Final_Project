import express = require('express');
const router: express.Router = new (express.Router as any)();
import data from '../data';
import * as utils from '../utils';
import xss from 'xss';
const users = data.users;

// Note: these routes do not yet consider any form of authentication.
// They merely exist to start us off.

router.get('/', async (req, res) => {
  try {
    const foundUsers = await users.getAll();
    res.json(foundUsers);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.route('/login').get(async (_req, res) => {
  try {
    res.render('login', { 'title': 'Login' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}).post(async (req, res) => {
  try {
    const user = utils.validateLoginAttempt(xss(req.body.email), xss(req.body.password));
    req.body.password = "";
    const status = await users.checkUser(user)
    user.password = "";
    req.session.user = status._id!;
    return res.json({ authenticated: true });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const b = req.body;
    console.log(
      b.email,
      b.password,
      b.firstName,
      b.lastName,
      b.appointmentIds,
      b.reviewIds,
      b.level
    );
    const usr = utils.validateUser(
      b.email,
      b.password,
      b.firstName,
      b.lastName,
      b.appointmentIds,
      b.reviewIds,
      b.level
    );
    res.json(await users.create(usr));
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const _id = utils.checkId(req.params.id, 'user');
    const usr = await users.getById(_id);
    res.json(usr);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
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
