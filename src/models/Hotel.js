const mongoose = require('mongoose');

const { Schema } = mongoose;

const HotelSchema = new Schema({
  applicantName: {
    type: String,
    required: true
  },
  businessEmail: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: Number,
    required: true
  },
  businessName: {
    type: String,
    required: true,
    unique: true
  },
  payBillNo: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'food.png'
  },
  paymentStatus: {
    type: String,
    default: 'UNPAID'
  },
  FCMToken: {
    type: String,
    default: ''
  }
}, { timestamps: true });


module.exports = mongoose.model('Hotel', HotelSchema);
