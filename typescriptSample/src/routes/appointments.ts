import express = require('express');
const router: express.Router = new (express.Router as any)();
import data from '../data';
import * as utils from '../utils';
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
      res.json(await appointments.create(appt));
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
