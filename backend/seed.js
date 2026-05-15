/**
 * Populate MongoDB with initial catalog and optional sample rows.
 * Safe to run multiple times: products/orders stay idempotent; admin user password and role are refreshed each run.
 * Sample reviews: run `npm run seed` or `npm run seed-reviews` (writes collection "reviews", 1–10 per product).
 *
 * Usage: from backend folder → npm run seed
 */
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Contact = require('./models/Contact');
const Inquiry = require('./models/Inquiry');
const catalog = require('./seed/catalog');
const { seedSampleReviewsForAllProducts } = require('./lib/seedProductReviews');

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Set MONGO_URI in backend/.env first.');
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`Connected to MongoDB — database name: "${mongoose.connection.name}" (open this exact name in Compass).`);

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(catalog);
    console.log(`Inserted ${catalog.length} products into "products".`);
  } else {
    console.log(`Skipped products (${productCount} already in database).`);
  }

  const demoEmail = 'demo@zahoorflourmills.local';
  const existingDemo = await User.findOne({ email: demoEmail });
  if (!existingDemo) {
    await User.create({
      name: 'Demo Customer',
      email: demoEmail,
      phone: '03001234567',
      password: await bcrypt.hash('demo123', 10),
      role: 'customer',
    });
    console.log(`Created demo user: ${demoEmail} / password: demo123`);
  } else {
    console.log('Skipped demo user (already exists).');
  }

  const adminEmail = 'admin@zahoorflourmills.local';
  const adminPass = 'admin123';
  const adminHash = await bcrypt.hash(adminPass, 10);
  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: {
        name: 'Site Admin',
        email: adminEmail,
        phone: '03000000001',
        password: adminHash,
        role: 'admin',
      },
    },
    { upsert: true, returnDocument: 'after', runValidators: true }
  );
  console.log(`Admin ready: ${adminEmail} / ${adminPass} (upserted; safe to re-run)`);

  const orderCount = await Order.countDocuments();
  if (orderCount === 0) {
    await Order.create({
      fullName: 'Sample Customer',
      phone: '03000000000',
      address: '135A Bypass, Sahiwal',
      city: 'Sahiwal',
      paymentMethod: 'cod',
      notes: 'Sample order created by seed script',
      items: [
        {
          name: 'Multi Grain Flour',
          quantity: 1,
          selectedWeight: '10kg',
          price: 2800,
        },
      ],
      subtotal: 2800,
      delivery: 250,
      total: 3050,
      status: 'Delivered',
    });
    console.log('Inserted 1 sample order into "orders".');
  } else {
    console.log(`Skipped sample order (${orderCount} order(s) already in database).`);
  }

  const contactCount = await Contact.countDocuments();
  if (contactCount === 0) {
    await Contact.create({
      name: 'Website Visitor',
      email: 'visitor@example.com',
      phone: '03001111111',
      subject: 'Sample contact',
      message: 'This row was created by npm run seed so you can see the contacts collection in Compass.',
    });
    console.log('Inserted 1 sample contact into "contacts".');
  } else {
    console.log('Skipped sample contact (contacts collection not empty).');
  }

  const inquiryCount = await Inquiry.countDocuments();
  if (inquiryCount === 0) {
    await Inquiry.create({
      businessName: 'Sample Traders',
      contactPerson: 'Ali Khan',
      phone: '03002222222',
      email: 'bulk@example.com',
      quantity: '100 bags x 40kg',
      message: 'Sample wholesale inquiry from seed script.',
      isRead: false,
    });
    console.log('Inserted 1 sample inquiry into "inquiries".');
  } else {
    console.log('Skipped sample inquiry (inquiries collection not empty).');
  }

  let reviewSeed;
  try {
    reviewSeed = await seedSampleReviewsForAllProducts();
  } catch (e) {
    console.error('\n!!! REVIEW SEED FAILED !!!');
    console.error(e.message || e);
    await mongoose.disconnect();
    process.exit(1);
  }
  if (reviewSeed.removedCount > 0) {
    console.log(`Removed ${reviewSeed.removedCount} old seed review(s) before re-insert.`);
  }
  console.log(
    `Reviews: inserted ${reviewSeed.totalInserted} documents for ${reviewSeed.productsUpdated} products (1–10 seed rows each). Compass → collection "reviews". Filter: { authorEmail: "${reviewSeed.seedEmail}" }`
  );

  console.log('\nDone. In Compass, refresh: products, users, orders, contacts, inquiries, reviews.');
  console.log('New sign-ups, logins, orders, and forms still go through the app API and will add more documents here.\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
