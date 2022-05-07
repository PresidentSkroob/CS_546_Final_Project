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
		if(req.session.user) { 
			const foundHairdressers = await users.getAllHairdressers();
			const relevantInformation = [];
			for(let i = 0; i < foundHairdressers.length; i++) { 
				relevantInformation.push({id: foundHairdressers[i]._id,
					 name: foundHairdressers[i].firstName + " " + foundHairdressers[i].lastName });
			}
	
			res.render('calendar', {title: 'Calendar',
									hairdressers: relevantInformation });
		} else { 
			res.redirect('/');
		}
	} catch (e) { 
		console.log(e);
		res.status(404).json({error : e});
	}
});



router.post('/service', async (req, res) => { 
	try { 
		if(req.session.user) { 
			const _id = utils.checkId(req.body.hairdressersdrop, "hairdresser id");
			utils.checkDate(req.body.datetime, "appointment datetime").toLocaleString();
			console.log(req.body);
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
	console.log(req.body);
	try { 
		if(req.session.user) {
			res.render('finalization', {service: req.body.service_selection, comments: req.body.comments });
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
    const foundAppointments = await appointments.getAllApptsByCustomerId2(_id);
    // Going to parse the list of appointments to pass stringified data
    let appointmentParser = [];

    // filter out an error message if no appoint history
    if (foundAppointments.length == 0) {
      let noAppointmentsNotif = "Hey! You have no previous appointments booked. If you think this is an error,\
      please contact customer support!"
      res.render('custappointhis', { noAppointmentsNotif, title: 'Appointment History'});
    } else {

    for (let i = 0; i < foundAppointments.length; i++) {
      const foundHairdresser = await users.getById(
        foundAppointments[i].hairdresserId
      );
      const salonistName =
        foundHairdresser.firstName + ' ' + foundHairdresser.lastName;
		const startDate = new Date(foundAppointments[i].startTime);
		const endDate = new Date(foundAppointments[i].endTime);
      // date parsing

      function ordinal_suffix_of(num: number) {
        const j = num % 10,
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

      const month = startDate.getUTCMonth(); // jan - 0, dec - 11
      const day = startDate.getUTCDate();
      const year = startDate.getUTCFullYear();
      const monthsArr = [
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
      const fullDay =
        monthsArr[month] + ' ' + ordinal_suffix_of(day) + ', ' + year;

      let typeService = foundAppointments[i].service;
      if (typeService == 'haircut') {
        typeService = 'Haircut';
      }
      const comments = foundAppointments[i].comments;
      let price = foundAppointments[i].price;

      const thisObj = {
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
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post('/check', async (req, res) => { 
	try { 
		await appointments.checkAppointmentByDateTimeAndHairdresser(xss(req.body.dateStr), xss(req.body.hid));
		
		res.json({success: true });
	} catch (e) { 
		console.log(e);
		res.json({success: false, error: e });
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
