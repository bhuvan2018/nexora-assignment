const express = require('express');
const Product = require('../models/Product');
const CartItem = require('../models/CartItem');

const router = express.Router();
const MOCK_USER_ID = process.env.MOCK_USER_ID || 'user_1';

router.post('/', async (req, res, next) => {
  try {
    const { cartItems, name, email } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'cartItems must be a non-empty array' });
    }
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }

    const productIds = cartItems.map(ci => ci.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    const productsMap = new Map(products.map(p => [String(p._id), p]));

    let total = 0;
    const itemsWithPrice = cartItems.map(ci => {
      const prod = productsMap.get(String(ci.productId));
      if (!prod) throw new Error(`Product not found: ${ci.productId}`);
      const qty = parseInt(ci.qty, 10) || 1;
      const lineTotal = prod.price * qty;
      total += lineTotal;
      return {
        productId: prod._id,
        name: prod.name,
        price: prod.price,
        qty,
        lineTotal
      };
    });

    const timestamp = new Date().toISOString();
    const receipt = {
      receiptId: `rcpt_${Date.now()}`,
      name,
      email,
      items: itemsWithPrice,
      total,
      timestamp
    };

    await CartItem.deleteMany({ userId: MOCK_USER_ID });

    res.json(receipt);
  } catch (err) {
    if (err.message && err.message.startsWith('Product not found')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

module.exports = router;