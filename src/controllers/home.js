const axios = require('axios');

const { Order } = require('../models/Orders');
const Fee = require('../models/Fee');

const API_BASE = process.env.API_BASE_URL;

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  let hotels = [];
  let orders = [];
  let items = [];
  axios.get(`${API_BASE}/hotels`)
    .then((response) => {
      hotels = response.data.hotels;
      return axios.get(`${API_BASE}/products`);
    })
    .then((response) => {
	    items = response.data.products;
	    return axios.get(`${API_BASE}/hotel/orders`);
    })
    .then((response) => {
      orders = response.data.orders;
      res.render('home', {
        title: 'Home',
        hotels,
        orders,
        items,
        totalHotels: hotels.length,
        totalOrders: orders.length,
        totalItems: items.length
      });
    })
    .catch((e) => {
      console.log(e.message);
    });
};

exports.plots = (req, res) => {
  Fee.find()
    .then((fees) => {
	    let x = [];
	    let y = [];
	    let z = [];
	    fees.forEach((fee) => {
		    x.push(fee.day);
		    y.push(fee.total);
		    z.push(fee.numberOfOrders);
	    });
	    let data = [
		    { x, y, type: 'line', title: 'Fees' },
		    // { x, z, type: 'line', title: 'Orders' }
      ];
	    // TODO:: Add orders as their own plots
	    res.json({ fees:[{ x, y, type: 'line', title: 'Fees' }], orders: [{ x, z, type: 'line', title: 'Orders' }] });
    }).catch(e=> {
      console.log(e.message);
  })
}
