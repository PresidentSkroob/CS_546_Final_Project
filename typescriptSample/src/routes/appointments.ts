import { privateDecrypt } from 'crypto';
import express = require('express');
const router: express.Router = new (express.Router as any)();
import data from '../data';
import * as utils from '../utils';
import { Appointment } from '../utils';
const users = data.users;
const appointments = data.appointments;

router
  .route('/')
  .get(async (_, res) => {
    try {
      const appts = await appointments.getAll();
      res.json(appts);
    } catch (e) {
      console.log(e);
      res.status(404).json({ error: e });
    }
  })
  .post(async (req, res) => {
    try {
      const b = req.body;
      console.log(
        b.customerId,
        b.hairdresserId,
        b.startTime,
        b.endTime,
        b.service,
        b.comments,
        b.price
      );
      const appt = utils.validateAppointment(
        b.customerId,
        b.hairdresserId,
        b.startTime,
        b.endTime,
        b.service,
        b.comments,
        b.price
      );
	  if(await appointments.checkAppointment(appt))
      	res.json(await appointments.create(appt));
    } catch (e) {
      console.log(e);
      res.status(404).json({ error: e });
    }
  });

// Calendar Route for Date/Time selection
router.get('/calendar', async (req, res) => { 
	try { 

		res.render('calendar', {title: 'Calendar'});
	} catch (e) { 
		console.log(e);
		res.status(404).json({error : e});
	}
});

router.get('/service', async (req, res) => { 
	try { 

	} catch (e) { 
		console.log(e);
		res.status(404).json({error: e});
	}
});


router.get('/appts/:hid', async (req, res) => {
  try {
    const _id = utils.checkId(req.params.hid, 'hairdresser id');
    const foundAppointments = await appointments.getAllApptsByHairdresserId(
      _id
    );
    res.json(foundAppointments);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.get('/history/:cid', async (req, res) => {
  try {
    // must be authenticated and logged in to view history
    const _id = utils.checkId(req.session.user, 'customer id');
    const foundAppointments = await appointments.getAllApptsByCustomerId(_id);
    // Going to parse the list of appointments to pass stringified data
    let appointmentParser = [];

    // filter out an error message if no appoint history
    // if (foundAppointments.length == 0) {
    //   let noAppointmentsNotif = "Hey! You have no previous appointments booked. If you think this is an error,\
    //   please contact customer support!"
    //   res.render('custappointhis', { noAppointmentsNotif });
    // }

    for(let i = 0; i < foundAppointments.length; i++) { 
      let foundHairdresser = await users.getById(foundAppointments[i].hairdresserId);
      let salonistName = foundHairdresser.firstName + " " + foundHairdresser.lastName;
      let startDate = new Date(foundAppointments[i].startTime);
      let endDate = new Date(foundAppointments[i].endTime);
      //date parsing

      function ordinal_suffix_of(num: number) {
        var j = num % 10,
            k = num % 100;
        if (j == 1 && k != 11) {
            return num + "st";
        }
        if (j == 2 && k != 12) {
            return num + "nd";
        }
        if (j == 3 && k != 13) {
            return num + "rd";
        }
        return num + "th";
      }

      var month = startDate.getUTCMonth(); // jan - 0, dec - 11
      var day = startDate.getUTCDate();
      var year = startDate.getUTCFullYear();
      let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let fullDay = monthsArr[month] + " " + ordinal_suffix_of(day) + ", " + year;

      let typeService = foundAppointments[i].service;
      if (typeService == 'haircut') {
        typeService = "Haircut"
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

      }
      appointmentParser.push(thisObj)}

  
    res.render('custappointhis', { appointmentParser, 'title': "Appointment History" });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.post('/bydate', async (req, res) => { 
	try { 
		let dateStr = req.body.dateStr;
		console.log(`dateStr in bydate: ${dateStr}`);
		const foundAppointments = await appointments.getAllAppointmentsOnDay(dateStr);
		res.json({success: true, bdy: foundAppointments});
	} catch (e) { 
		console.log(e);
		res.status(404).json({ error: e });
	}
});

router.route('/:id').get(async (req, res) => {
  try {
    const _id = utils.checkId(req.params.id, 'appointment');
    const appt = await appointments.get(_id);
    res.json(appt);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});


export = router;
