const bcrypt = require('bcrypt');

const Hotel = require('../models/Hotel');
const Product = require('../models/Product');
const User = require('../models/User');
const Fee = require('../models/Fee');
const Payment = require('../models/Payment');

exports.index = (req, res) => {
  res.render('hotel/index', {
    title: 'Hotels'
  });
};

/*
* GET /hotel/:id
* Hotel page
*/
exports.hotel = (req, res) => {
  const { id } = req.params;
  const data = {
    hotel: {},
    orders: [],
    products: [],
    staff: [],
    payments: []
  };
  Hotel.findById(id)
    .then((hotel) => {
      if (hotel) {
        // TODO:: +254
        hotel.mobileNumber = hotel.mobileNumber.toString()[0] === '7' ? `+254${hotel.mobileNumber.toString()}` : hotel.mobileNumber;
        data.hotel = hotel;
        return Product.find({ hotel: hotel._id });
      }
      return res.json({ error: 'Hotel not found' });
    })
    .then((products) => {
      data.products = products;
      return User.find({ hotel: data.hotel._id });
    })
	  .then((staff) => {
		  data.staff = staff;
		  return Payment.find({ hotel: data.hotel._id }).sort('asc');
	  })
    .then((payments) => {
      data.payments = payments;
      return Fee.find({ hotel: data.hotel._id }).sort('asc');
    })
    .then((fees) => {
    	let payment = new Payment();
    	res.render('hotel', {
    		title: data.hotel.businessName,
		    hotel: data.hotel,
		    products: data.products,
        fees,
		    payment,
		    staff: data.staff,
		    payments: data.payments
	    });
    })
    .catch((e) => {
      console.log(e.message);
      req.flash('errors', { msg: e.message });
      res.render('hotel', {
        title: 'Not found'
      });
    });
};


exports.delete = (req, res) => {
  Hotel.findOneAndDelete(req.params.id)
    .then(hotel => {
      req.flash('success', { msg: 'Success! Hotel deleted.' });
      res.redirect('/');
    })
    .catch(e => {
      console.log(e.message);
    });
}

exports.suspend = (req, res) => {
  Hotel.findOneAndUpdate(req.params.id, { paymentStatus: 'SUSPENDED' }, { new: true })
    .then(hotel => {
      res.redirect(`/hotels/${hotel._id}`);
    })
    .catch(e => {
      console.log(e.message);
    });
}
