const Payment = require('../models/Payment');

const API_BASE = process.env.API_BASE_URL;

exports.pay = async (req, res) => {
  const payment = new Payment(req.body);
  payment.hotel = req.params.hotelId;
  try {
    if (payment.total <= 0) throw new Error('Amount must be greater than 0;');
    await payment.save();
  } catch (e) {
    req.flash('success', { msg: `${payment.total} Payment added successfully` });
    res.json({ success: false, message: e.message });
  }
  res.redirect(`/hotels/${req.params.hotelId}`);
};
