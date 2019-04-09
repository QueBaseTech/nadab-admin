const mongoose = require('mongoose');

const { Schema, Types } = mongoose;

const OrderItemsSchema = new Schema({
  name: String,
  id: {
    type: Types.ObjectId,
    ref: 'Product'
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'NEW'
  },
  reason: String
});

const OrderPaymentsSchema = new Schema({
  method: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionCode: {
    type: String
  }
});

const OrderSchema = new Schema({
  status: {
    type: String,
    default: 'NEW'
  },
  hotel: {
    type: Types.ObjectId,
    ref: 'Hotel',
    require: true
  },
  totalItems: {
    type: Number,
    require: true
  },
  totalPrice: {
    type: Number,
    require: true
  },
  items: [OrderItemsSchema],
  payments: [OrderPaymentsSchema],
  servedBy: {
    type: Types.ObjectId,
    ref: 'User'
  },
  customerId: {
    type: Types.ObjectId,
    ref: 'Customer'
  }
}, { timestamps: true });

exports.Order = mongoose.model('Order', OrderSchema);
exports.OrderItemSchema = mongoose.model('OrderItemsSchema', OrderItemsSchema);
exports.OrderPaymentsSchema = mongoose.model('OrderPaymentsSchema', OrderPaymentsSchema);
