const mongoose = require('mongoose');

const { Schema, Types } = mongoose;

const PaymentSchema = new Schema({
  total: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  transactionCode: {
    type: String,
    default: ''
  },
  note: {
    type: String,
    default: ''
  },
  hotel: {
    type: Types.ObjectId,
    refs: 'Hotel',
    required: true
  }
}, { timestamps: true });


module.exports = mongoose.model('Payment', PaymentSchema);
