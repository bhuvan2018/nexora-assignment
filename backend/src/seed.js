require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vibe_ecom_dev';

const sampleProducts = [
  { name: 'Classic Tee', price: 450, description: 'Comfortable cotton tee.', imageUrl: '' },
  { name: 'Running Sneakers', price: 999, description: 'Lightweight sneakers for daily runs.', imageUrl: '' },
  { name: 'Denim Jacket', price: 1699, description: 'Stylish denim jacket.', imageUrl: '' },
  { name: 'Wireless Headphones', price: 2499, description: 'Over-ear Bluetooth headphones.', imageUrl: '' },
  { name: 'Coffee Mug', price: 125, description: 'Ceramic mug 350ml.', imageUrl: '' },
  { name: 'Canvas Backpack', price: 1399, description: 'Durable daypack.', imageUrl: '' }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {});
    console.log('Connected to MongoDB for seeding');

    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log('Seeded products');
    } else {
      console.log(`Products collection already has ${count} documents — skipping seed`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
}

seed();