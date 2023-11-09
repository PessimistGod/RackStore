const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User Details',
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product Details',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
});

mongoose.models = {}
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
