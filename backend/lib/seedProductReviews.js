/**
 * Inserts sample reviews into MongoDB (collection: "reviews") for every product.
 * Safe to run repeatedly: removes only rows with authorEmail seed@zahoorflourmills.local,
 * then adds 1–10 new seed reviews per product and refreshes products.rating / products.reviews.
 */
const Review = require('../models/Review');
const Product = require('../models/Product');
const { syncProductReviewStats } = require('../utils/syncProductReviewStats');

const SEED_REVIEW_EMAIL = 'seed@zahoorflourmills.local';

const sampleTitles = [
  'Excellent quality',
  'Very satisfied',
  'Great for roti',
  'Fresh as advertised',
  'Good value',
  'Highly recommend',
  'Consistent quality',
  'Soft rotis every time',
];

const sampleComments = [
  'Really happy with this flour.',
  'Will order again.',
  'Family liked the results.',
  'Packaging was clean and delivery smooth.',
  'Recommend for daily use.',
  'Good price for the quality.',
  'Trusted brand in our area.',
  'No complaints — five stars.',
];

/**
 * @returns {{ totalInserted: number, productsUpdated: number }}
 */
async function seedSampleReviewsForAllProducts() {
  const removed = await Review.deleteMany({ authorEmail: SEED_REVIEW_EMAIL });
  const products = await Product.find().select('_id name').lean();
  if (products.length === 0) {
    const err = new Error(
      'Cannot seed reviews: the "products" collection is empty. Run `npm run seed` once from the backend folder (it inserts the catalog), then run `npm run seed-reviews` again. In Compass, select the same database name as in your MONGO_URI (see server console on startup).'
    );
    err.code = 'NO_PRODUCTS';
    throw err;
  }

  let totalInserted = 0;

  for (const p of products) {
    const n = 1 + Math.floor(Math.random() * 10);
    const batch = [];
    for (let i = 0; i < n; i += 1) {
      const rating = 1 + Math.floor(Math.random() * 5);
      batch.push({
        productId: p._id,
        authorName: `Customer ${i + 1}`,
        authorEmail: SEED_REVIEW_EMAIL,
        rating,
        title: sampleTitles[i % sampleTitles.length],
        comment: `${sampleComments[i % sampleComments.length]} — ${p.name}.`,
        approved: true,
      });
    }
    try {
      await Review.insertMany(batch, { ordered: false });
    } catch (e) {
      console.error(`Review insertMany failed for product ${p._id} (${p.name}):`, e.message);
      throw e;
    }
    totalInserted += n;
    await syncProductReviewStats(p._id);
  }

  return {
    totalInserted,
    productsUpdated: products.length,
    seedEmail: SEED_REVIEW_EMAIL,
    removedCount: removed.deletedCount,
  };
}

module.exports = {
  seedSampleReviewsForAllProducts,
  SEED_REVIEW_EMAIL,
};
