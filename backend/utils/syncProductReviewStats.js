const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');

/**
 * Recompute average rating and review count on a product from all reviews in MongoDB.
 */
async function syncProductReviewStats(productId) {
  const id = new mongoose.Types.ObjectId(productId);
  const agg = await Review.aggregate([
    { $match: { productId: id } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const avg = agg[0]?.avgRating ?? 0;
  const count = agg[0]?.count ?? 0;
  const ratingRounded = Math.round(avg * 10) / 10;
  await Product.findByIdAndUpdate(productId, {
    rating: count ? ratingRounded : 0,
    reviews: count,
  });
}

module.exports = { syncProductReviewStats };
