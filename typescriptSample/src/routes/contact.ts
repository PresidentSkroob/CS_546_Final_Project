import express = require('express');
const router: express.Router = new (express.Router as any)();
import qrcode from 'qrcode';


router.route('/qr').post(async (req, res) => {
  try {
    const im = await qrcode.toDataURL(req.body.url)
    return res.json({ success: true, img: im });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.use('/', async (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

router.use('*', (_, res) => {
  res.status(404).json({ error: 'Not found' });
});

export = router;
