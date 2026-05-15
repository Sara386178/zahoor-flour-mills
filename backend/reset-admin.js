/**
 * Only creates/updates the site admin user (same as the admin block in seed.js).
 * Use when admin login fails: from backend folder → npm run reset-admin
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const adminEmail = 'admin@zahoorflourmills.local';
const adminPass = 'admin123';

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Set MONGO_URI in backend/.env first.');
    process.exit(1);
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  const hash = await bcrypt.hash(adminPass, 10);
  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: {
        name: 'Site Admin',
        email: adminEmail,
        phone: '03000000001',
        password: hash,
        role: 'admin',
      },
    },
    { upsert: true, returnDocument: 'after', runValidators: true }
  );
  console.log(`Admin OK — sign in with:\n  Email: ${adminEmail}\n  Password: ${adminPass}\n`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
