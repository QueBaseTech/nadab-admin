const Hotel = require('../models/Hotel');
const Product = require('../models/Product');
const User = require('../models/User');

/*
* GET /hotel/:id
* Hotel page
*/
exports.hotel = (req, res) => {
  const { id } = req.params;
  const data = {
    hotel: {},
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
      res.render('hotel', {
        title: data.hotel.businessName,
        hotel: data.hotel,
        products: data.products,
        staff: data.staff,
        payments: data.payments
      });
    })
    .catch((e) => {
      res.render('hotel', {
        title: 'Not found'
      });
    });
};
