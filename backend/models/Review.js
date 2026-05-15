const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    authorName: { type: String, required: true, trim: true },
    authorEmail: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, default: '' },
    comment: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema, 'reviews');
