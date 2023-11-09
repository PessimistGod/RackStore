const express = require('express');
const router = express.Router();
const Order = require('../Models/Orders');


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
module.exports = router;
