import express = require('express');
const router: express.Router = new (express.Router as any)();
import data from '../data';
import * as utils from '../utils';
const reviews = data.reviews;
const users = data.users;
const appointments = data.appointments;

router.use('/', async (req, res) => {
  try {
    const foundUsers = await users.getAll();
    // This returns the objs of all the users, now I have to filter by level admin in order to get hairdressers only
    let listOfAdmins:Object[] = [];
    
    foundUsers.forEach(x =>
      {if (x.level == "admin") {
        let salonistName = x.firstName + " " + x.lastName;
        let prof = x.job.charAt(0).toUpperCase() + x.job.slice(1);
        let biography = x.biography;

        let thisObj =
        { 
          first: x.firstName,
          fullName: salonistName,
          contact: x.email,
          specialty: prof,
          biography: biography
        }

        listOfAdmins.push(thisObj);
      }}
    );
      console.log(listOfAdmins);
    res.render('about', { listOfAdmins, title: 'About Us' });
  } catch(e) {
    res.status(404).json({ error: e });
  }
});

router.use('*', (_, res) => {
  res.status(404).json({ error: 'Not found' });
});
export = router;
