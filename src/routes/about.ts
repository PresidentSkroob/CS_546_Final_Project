import express = require('express');
const router: express.Router = new (express.Router as any)();
import data from '../data';
const reviews = data.reviews;
const users = data.users;

router.use('/', async (req, res) => {
  try {
    const foundUsers = await users.getAll();
    // This returns the objs of all the users, now I have to filter by level admin in order to get hairdressers only
    const listOfAdmins: Object[] = [];

    for (let x = 0; x < foundUsers.length; x++) {
      {
        if (foundUsers[x].level == 'hairdresser') {
          const salonistName =
            foundUsers[x].firstName + ' ' + foundUsers[x].lastName;
          const prof =
            foundUsers[x].job.charAt(0).toUpperCase() +
            foundUsers[x].job.slice(1);
          const biography = foundUsers[x].biography;

          const reviewByHaidresser =
            await reviews.getAllReviewsByHairdresserId2(foundUsers[x]._id!);
          if (!reviewByHaidresser || reviewByHaidresser.length == 0) {
            const emptyStr = 'No reviews for this hairdresser!';
            const thisObj = {
              first: foundUsers[x].firstName,
              fullName: salonistName,
              contact: foundUsers[x].email,
              specialty: prof,
              biography: biography,
              emptyStr,
            };
            listOfAdmins.push(thisObj);
          } else {
            const thisObj = {
              first: foundUsers[x].firstName,
              fullName: salonistName,
              contact: foundUsers[x].email,
              specialty: prof,
              biography: biography,
              reviews: reviewByHaidresser,
            };
            listOfAdmins.push(thisObj);
          }
        }
      }
    }

    res.render('about', { listOfAdmins, title: 'About Us' });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.use('*', (_, res) => {
  res.status(404).json({ error: 'Not found' });
});
export = router;
