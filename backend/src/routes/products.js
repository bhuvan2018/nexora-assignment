const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().lean();
    const mapped = products.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      description: p.description,
      imageUrl: p.imageUrl
    }));
    res.json(mapped);
  } catch (err) {
    next(err);
  }
});

module.exports = router;