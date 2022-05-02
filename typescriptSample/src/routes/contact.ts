import express = require('express');
const router: express.Router = new (express.Router as any)();

router.use('/', async (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

router.use('*', (_, res) => {
  res.status(404).json({ error: 'Not found' });
});
export = router;
