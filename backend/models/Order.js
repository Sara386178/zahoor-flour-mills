const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    paymentMethod: String,
    notes: String,
    items: Array,
    subtotal: Number,
    delivery: Number,
    total: Number,
    status: {
      type: String,
      default: 'Pending',
    },
    stripePaymentIntentId: { type: String },
    paymentStatus: {
      type: String,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema, 'orders');
