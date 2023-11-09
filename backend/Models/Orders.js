const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userDetails: Array,
    cartItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product Details',
            },
            quantity: Number,
        },
    ],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
