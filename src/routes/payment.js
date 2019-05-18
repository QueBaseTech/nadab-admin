const router = require('express')
  .Router();
const Payment = require('../models/Payment');

router.post('/pay/:hotelId', async (req, res) => {
  let payment = new Payment(req.body);
  payment = await payment.save();
  res.json({ payment });
});

router.get('/pay/:hotelId', async (req, res) => {

  res.json({ payment: 'paid' });
});

module.exports = (app) => {
  app.use('/payments', router);
};
