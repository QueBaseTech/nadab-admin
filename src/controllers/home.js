const axios = require('axios');
const moment = require('moment');

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
      let days = [];
      let tFee = [];
      let orders = [];
      // Get todays date,
      // compare with the latest fee,
      // get 7 days earlier records
      const stime = moment().subtract(14, 'days');
      fees.forEach((fee) => {
        if (moment(fee.createdAt).isAfter(stime)) {
          let index = days.indexOf(fee.day);
          if(index > -1){
            tFee[index] += fee.total;
            orders[index] += fee.numberOfOrders;
          } else {
            days.push(fee.day);
            tFee.push(fee.total);
            orders.push(fee.numberOfOrders);
          }
        }
      });
      // TODO:: Add orders as their own plots
      res.json({
        fees: [{
          x: days,
          y: tFee,
          mode: 'lines',
          name: 'Fees',
          line: {shape: 'linear'}, 
          type: 'scatter',
          mode: 'lines+markers',
          connectgaps: true
        }],
        orders: [{
          x: days,
          y: orders,
          mode: 'lines',
          name: 'Orders',
          line: {shape: 'linear'}, 
          type: 'scatter',
          mode: 'lines+markers',
          connectgaps: true
        }]
      });
    })
    .catch(e => {
      console.log(e.message);
    });
};
