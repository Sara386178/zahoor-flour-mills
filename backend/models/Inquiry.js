const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    quantity: { type: String, required: true },
    message: String,
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema, 'inquiries');
