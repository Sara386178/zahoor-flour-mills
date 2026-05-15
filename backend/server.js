const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5000;

async function start() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Missing MONGO_URI in backend/.env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully');
    const Review = require('./models/Review');
    const Product = require('./models/Product');
    const dbName = mongoose.connection.name;
    const [nReviews, nProducts] = await Promise.all([Review.countDocuments(), Product.countDocuments()]);
    console.log(
      `[MongoDB] Database: "${dbName}" — In Compass, open this database (not "admin" / a random name). Collections: products=${nProducts}, reviews=${nReviews}. If reviews=0, run from backend folder: npm run seed-reviews`
    );
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Start MongoDB locally or set MONGO_URI to MongoDB Atlas, then restart the server.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
