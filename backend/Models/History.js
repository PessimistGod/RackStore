const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userDetails: Array,
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductDetails',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',
    required: true,
  },
}, { timestamps: true });

const History = mongoose.model('OrderHistory', historySchema);

module.exports = History;
