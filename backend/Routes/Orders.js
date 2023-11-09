const express = require('express');
const router = express.Router();
const Order = require('../Models/Orders');
const Product = require('../Models/Products')
const History = require('../Models/History')


router.post('/new-order', async (req, res) => {
  try {
    const { userDetails, cartItems } = req.body;

    // Create a new order
    const newOrder = new Order({
      userDetails,
      cartItems,
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/get-orders', async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.delete('/delete-order/:orderId', async (req, res) => {
    try {
      const orderId = req.params.orderId;
  
      const deletedOrder = await Order.findByIdAndDelete(orderId);
  
      if (!deletedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json({ message: 'Order successfully Delivered' });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/set-order-history', async (req, res) => {
    try {
      const { userDetails, cartItems, userId } = req.body;
  
      const newOrder = await History.create({
        userDetails,
        cartItems,
        userId,
      });
  
      for (const cartItem of cartItems) {
        const { productId } = cartItem;
        await Product.findByIdAndUpdate(productId, { availability: false });
      }
  
      res.json({ message: 'Order placed successfully', orderId: newOrder._id });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/history/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      const historyDetails = await History.find({ userId });
  
      res.status(200).json(historyDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
module.exports = router;
