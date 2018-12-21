const axios = require('axios');

const API_BASE = process.env.API_BASE_URL;

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  let hotels = [];
  let products = [];
  let items = [];
  axios.get(`${API_BASE}/hotels`)
    .then((response) => {
      hotels = response.data.hotels;
      return axios.get(`${API_BASE}/products`);
    })
    .then((response) => {
      products = response.data.products;
      return axios.get(`${API_BASE}/products`);
    })
    .then((response) => {
      items = response.data.products;
      res.render('home', {
        title: 'Home',
        hotels,
        products,
        items,
        totalHotels: hotels.length,
        totalProducts: products.length,
        totalItems: items.length
      });
    })
    .catch((e) => {
      console.log(e.message);
    });
};
