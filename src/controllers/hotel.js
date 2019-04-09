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


exports.delete = async (req, res) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);
  if (hotel) {
    req.flash('success', { msg: 'Success! Hotel deleted.' });
    res.redirect('/');
  }
};

exports.suspend = (req, res) => {
  const { id } = req.params;
  Hotel.findByIdAndUpdate(id, { paymentStatus: 'SUSPENDED' }, { new: true })
    .then((hotel) => {
      res.redirect(`/hotels/${id}`);
    })
    .catch((e) => {
      console.log(e.message);
    });
};

exports.add = async (req, res) => {
  if (req.method === 'GET') {
    res.render('hotel/add', { title: 'Add Hotel', hotel: new Hotel() });
  }

  if (req.method === 'POST') {
    if (req.body === undefined) {
      throw new Error('A request body is required');
    }
    const hotel = new Hotel(req.body);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(hotel.password, salt);
    hotel.password = hash;
    hotel.save()
      .then((h) => {
        req.flash('success', { msg: 'Hotel added successfuly.' });
        res.redirect(`/hotels/${h._id}`);
        // TODO:: Send verification email ~ via a message broker
      })
      .catch((e) => {
        e.message.toString().split(',').forEach((e) => {
          req.flash('errors', { msg: e });
        });
        res.render('hotel/add', { title: 'Add Hotel', hotel });
      });
  }
};
