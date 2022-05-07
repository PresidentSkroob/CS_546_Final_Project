import express = require('express');
const router: express.Router = new (express.Router as any)();
import xss from 'xss';
import data from '../data';
import * as utils from '../utils';
const users = data.users;
const appointments = data.appointments;

router
  .route('/')
  .get(async (_, res) => {
    try {
      const appts = await appointments.getAll();
      res.json(appts);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })
  .post(async (req, res) => {
    try {
      const b = req.body;
      const appt = utils.validateAppointment(
        b.customerId,
        b.hairdresserId,
        b.startTime,
        b.endTime,
        b.service,
        b.comments,
        b.price
      );
      if (await appointments.checkAppointment(appt))
        res.json(await appointments.create(appt));
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

// Calendar Route for Date/Time selection
router.get('/calendar', async (req, res) => {
  try {
    if (req.session.user) {
      const foundHairdressers = await users.getAllHairdressers();
      const relevantInformation = [];
      for (let i = 0; i < foundHairdressers.length; i++) {
        relevantInformation.push({
          id: foundHairdressers[i]._id,
          name: foundHairdressers[i].firstName + " " + foundHairdressers[i].lastName
        });
      }

      res.render('calendar', {
        title: 'Calendar',
        hairdressers: relevantInformation
      });
    } else {
      res.redirect('/');
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});



router.post('/service', async (req, res) => { 
	try { 
		if(req.session.user) { 
			const _id = utils.checkId(req.body.hairdressersdrop, "hairdresser id");
			utils.checkDate(req.body.datetime, "appointment datetime").toLocaleString();
			const foundHairdresser = await users.getById(xss(_id));
			res.render('service', {title: "Service Page", datetime: xss(req.body.datetime), hairdresser: {name: foundHairdresser.firstName + " " + foundHairdresser.lastName, id: xss(req.body.hairdressersdrop)} });
		} else { 
			res.redirect("/");
		}
	} catch (e) { 
		console.log(e);
		res.status(400).render('error', {
			title: 'Error',
			'error-msg': e,
			'error-status': 400
		});
	}
});

router.post('/finalization', async (req, res) => {
	try { 
		if(req.session.user) {
      let foundHairdresser = await users.getById(req.body.hairdresser);
      let salonistName = foundHairdresser.firstName + ' ' + foundHairdresser.lastName;
      let date = new Date(req.body.datetime).getTime();
      let price = 0;
      if (req.body.service_selection == "cutandcolor") {
        price = 80;
      } else if (req.body.service_selection == "washandcut") {
        price = 65;
      } else {
        price = 45;
      }
      let a = new Date(req.body.datetime);
      a.setHours(a.getHours()+1);
      let timeEnd = a.getTime();
      let renderedInfo = {
        hairdresserId: req.body.hairdresser,
        hairdresser: salonistName,
        timeLiteralStart: date,
        timeLiteralEnd: timeEnd,
        timeFormat: req.body.datetime,
        comments: req.body.comments,
        service: req.body.service_selection,
        price: price
      }
			res.render('finalization', renderedInfo);
		} else { 
			res.redirect("/");
		}

	} catch (e) { 
		console.log(e);
		res.status(404).json({error: e});
	}
})

router.post('/confirmation', async (req, res) => {
	try { 
		if(req.session.user) {
      const b = req.body;
      const appt = utils.validateAppointment(
        req.session.user,
        b.hairdresserId,
        parseFloat(b.timeLiteralStart),
        parseFloat(b.timeLiteralEnd),
        b.service,
        b.comments,
        parseFloat(b.price)
      );
      appointments.create(appt);
			res.render('confirmation');
		} else { 
			res.redirect("/");
		}

  } catch (e) {
    console.log(e);
    res.status(400).render('error', {
      title: 'Error',
      'error-msg': e,
      'error-status': 400
    });
  }
})

router.get('/appts/:hid', async (req, res) => {
  try {
    const _id = utils.checkId(req.params.hid, 'hairdresser id');
    const foundAppointments = await appointments.getAllApptsByHairdresserId(
      _id
    );
    res.json(foundAppointments);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get('/history/:cid', async (req, res) => {
  try {
    // must be authenticated and logged in to view history
    const _id = utils.checkId(req.session.user, 'customer id');
    const usr = await users.getById(_id);
    if (usr.level !== 'hairdresser') {
      const foundAppointments = await appointments.getAllApptsByCustomerId2(_id);
      // Going to parse the list of appointments to pass stringified data
      let appointmentParser = [];

      // filter out an error message if no appoint history
      if (foundAppointments.length == 0) {
        let noAppointmentsNotif = "Hey! You have no previous appointments booked. If you think this is an error,\
      please contact customer support!"
        res.render('custappointhis', { noAppointmentsNotif, title: 'Appointment History' });
      } else {

        for (let i = 0; i < foundAppointments.length; i++) {
          let foundHairdresser = await users.getById(
            foundAppointments[i].hairdresserId
          );
          let salonistName =
            foundHairdresser.firstName + ' ' + foundHairdresser.lastName;
          let startDate = new Date(foundAppointments[i].startTime);
          let endDate = new Date(foundAppointments[i].endTime);
          //date parsing

          function ordinal_suffix_of(num: number) {
            var j = num % 10,
              k = num % 100;
            if (j == 1 && k != 11) {
              return num + 'st';
            }
            if (j == 2 && k != 12) {
              return num + 'nd';
            }
            if (j == 3 && k != 13) {
              return num + 'rd';
            }
            return num + 'th';
          }

          var month = startDate.getUTCMonth(); // jan - 0, dec - 11
          var day = startDate.getUTCDate();
          var year = startDate.getUTCFullYear();
          let monthsArr = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          let fullDay =
            monthsArr[month] + ' ' + ordinal_suffix_of(day) + ', ' + year;

          let typeService = foundAppointments[i].service;
          if (typeService == 'haircut') {
            typeService = 'Haircut';
          }
          let comments = foundAppointments[i].comments;
          let price = foundAppointments[i].price;

          let thisObj = {
            dateAlone: fullDay,
            hairdresserName: salonistName,
            startTime: startDate,
            endTime: endDate,
            service: typeService,
            comments: comments,
            price: price,
          };
          appointmentParser.push(thisObj);
        }

        res.render('custappointhis', {
          appointmentParser,
          title: 'Appointment History',
        });
      }
    } else {
      const foundAppointments = await appointments.getAllApptsByHairdresserId2(_id);
      // Going to parse the list of appointments to pass stringified data
      let appointmentParser = [];

      // filter out an error message if no appoint history
      if (foundAppointments.length == 0) {
        let noAppointmentsNotif = "Hey! You have no appointments booked. If you think this is an error,\
      please contact customer support!"
        res.render('hdappts', { noAppointmentsNotif, title: 'Appointment History' });
      } else {

        for (let i = 0; i < foundAppointments.length; i++) {
          let foundCustomer = await users.getById(
            foundAppointments[i].customerId
          );
          let customerName =
            foundCustomer.firstName + ' ' + foundCustomer.lastName;
          let startDate = new Date(foundAppointments[i].startTime);
          let endDate = new Date(foundAppointments[i].endTime);
          //date parsing

          function ordinal_suffix_of(num: number) {
            var j = num % 10,
              k = num % 100;
            if (j == 1 && k != 11) {
              return num + 'st';
            }
            if (j == 2 && k != 12) {
              return num + 'nd';
            }
            if (j == 3 && k != 13) {
              return num + 'rd';
            }
            return num + 'th';
          }

          var month = startDate.getUTCMonth(); // jan - 0, dec - 11
          var day = startDate.getUTCDate();
          var year = startDate.getUTCFullYear();
          let monthsArr = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          let fullDay =
            monthsArr[month] + ' ' + ordinal_suffix_of(day) + ', ' + year;

          let typeService = foundAppointments[i].service;
          if (typeService == 'haircut') {
            typeService = 'Haircut';
          }
          let comments = foundAppointments[i].comments;
          let price = foundAppointments[i].price;

          let thisObj = {
            dateAlone: fullDay,
            hairdresserName: customerName,
            startTime: startDate,
            endTime: endDate,
            service: typeService,
            comments: comments,
            price: price,
          };
          appointmentParser.push(thisObj);
        }

        res.render('hdappt', {
          appointmentParser,
          title: 'Appointment History',
        });
      }

    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post('/check', async (req, res) => {
  try {
    await appointments.checkAppointmentByDateTimeAndHairdresser(xss(req.body.dateStr), xss(req.body.hid));

    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.json({ success: false, error: e });
    // res.status(400).render('calendar', { title: 'Calendar',  error: e });
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const _id = utils.checkId(req.params.id, 'appointment');
    const appt = await appointments.get(_id);
    res.json(appt);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});


export = router;
