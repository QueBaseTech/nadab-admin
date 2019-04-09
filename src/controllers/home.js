const axios = require('axios');

const { Order } = require('../models/Orders');

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
