/**
 * Only (re)seeds sample product reviews in MongoDB — fast way to fill Compass "reviews".
 * From backend folder: npm run seed-reviews
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const { seedSampleReviewsForAllProducts } = require('./lib/seedProductReviews');

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Set MONGO_URI in backend/.env first.');
    process.exit(1);
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB');
  const dbName = mongoose.connection.name;
  const pc = await mongoose.connection.db.collection('products').countDocuments();
  console.log(`Database: "${dbName}"  |  products collection: ${pc} document(s)`);
  if (pc === 0) {
    console.error('No products — seed reviews skipped until products exist. Run: npm run seed');
    process.exit(1);
  }
  const r = await seedSampleReviewsForAllProducts();
  const rc = await mongoose.connection.db.collection('reviews').countDocuments();
  console.log(
    `Done. Inserted ${r.totalInserted} seed review(s). Collection "reviews" now has ${rc} document(s) total. In Compass open database "${dbName}" → collection "reviews".`
  );
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
