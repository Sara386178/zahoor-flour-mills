const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { syncProductReviewStats } = require('../utils/syncProductReviewStats');
const { requireAdmin } = require('../middleware/auth');

/** Public: all reviews for one product (same documents as in MongoDB / Compass). */
router.get('/product/:productId', async (req, res) => {
  try {
    const raw = req.params.productId;
    if (!mongoose.Types.ObjectId.isValid(raw)) {
      return res.json([]);
    }
    const list = await Review.find({ productId: raw }).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/** Public: submit a review */
router.post('/', async (req, res) => {
  try {
    const { productId, authorName, authorEmail, rating, title, comment } = req.body;
    if (!productId || !authorName || rating == null || !comment) {
      return res.status(400).json({ message: 'productId, authorName, rating, and comment are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(String(productId))) {
      return res.status(400).json({ message: 'Invalid productId' });
    }
    const r = Number(rating);
    if (r < 1 || r > 5 || !Number.isInteger(r)) {
      return res.status(400).json({ message: 'rating must be an integer 1–5' });
    }
    const productOk = await Product.exists({ _id: productId });
    if (!productOk) {
      return res.status(400).json({
        message:
          'Invalid productId: no matching product in MongoDB. Open Compass → products, copy a document _id, or reload the shop after running npm run seed.',
      });
    }
    const review = await Review.create({
      productId,
      authorName: String(authorName).trim(),
      authorEmail: authorEmail ? String(authorEmail).trim() : undefined,
      rating: r,
      title: title ? String(title).trim() : '',
      comment: String(comment).trim(),
      approved: true,
    });
    await syncProductReviewStats(review.productId);
    console.log(`[reviews] Saved to MongoDB collection "reviews": _id=${review._id} productId=${review.productId}`);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/** Admin: all reviews (including unapproved) */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const list = await Review.find().sort({ createdAt: -1 }).populate('productId', 'name');
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    await syncProductReviewStats(review.productId);
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const prev = await Review.findById(req.params.id);
    if (!prev) {
      return res.status(404).json({ message: 'Review not found' });
    }
    await Review.findByIdAndDelete(req.params.id);
    await syncProductReviewStats(prev.productId);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
