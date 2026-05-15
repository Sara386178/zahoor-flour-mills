const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,

    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    image: {
      type: String,
    },
    weights: [
      {
        type: String,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema, 'products');