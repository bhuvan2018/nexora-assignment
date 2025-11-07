const express = require('express');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

const router = express.Router();

const MOCK_USER_ID = process.env.MOCK_USER_ID || 'user_1';

function computeTotal(items) {
  return items.reduce((sum, it) => sum + (it.product.price * it.qty), 0);
}

router.post('/', async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const quantity = parseInt(qty, 10) || 1;
    if (!productId) return res.status(400).json({ error: 'productId is required' });
    if (quantity < 1) return res.status(400).json({ error: 'qty must be >= 1' });

    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ error: 'Product not found' });

    let cartItem = await CartItem.findOne({ userId: MOCK_USER_ID, product: productId });
    if (cartItem) {
      cartItem.qty += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        userId: MOCK_USER_ID,
        product: productId,
        qty: quantity
      });
    }

    await cartItem.populate('product');

    res.status(201).json({
      id: cartItem._id,
      product: {
        id: cartItem.product._id,
        name: cartItem.product.name,
        price: cartItem.product.price,
      },
      qty: cartItem.qty
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const items = await CartItem.find({ userId: MOCK_USER_ID }).populate('product').lean();

    const responseItems = items.map(it => ({
      id: it._id,
      product: {
        id: it.product._id,
        name: it.product.name,
        price: it.product.price,
      },
      qty: it.qty
    }));

    const total = computeTotal(items);

    res.json({ items: responseItems, total });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const removed = await CartItem.findOneAndDelete({ _id: id, userId: MOCK_USER_ID });
    if (!removed) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'removed', id: removed._id });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { qty } = req.body;
    const quantity = parseInt(qty, 10);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'qty must be integer >= 1' });
    }
    const updated = await CartItem.findOneAndUpdate(
      { _id: id, userId: MOCK_USER_ID },
      { qty: quantity },
      { new: true }
    ).populate('product');

    if (!updated) return res.status(404).json({ error: 'Cart item not found' });

    res.json({
      id: updated._id,
      product: {
        id: updated.product._id,
        name: updated.product.name,
        price: updated.product.price
      },
      qty: updated.qty
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;