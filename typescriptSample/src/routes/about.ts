import express = require('express');
const router: express.Router = new (express.Router as any)();


router.use('/', async (req, res) => {
    res.render('about', { title: "About Us" })
});

router.use('*', (_, res) => {
    res.status(404).json({ error: 'Not found' });
  });
export = router;
