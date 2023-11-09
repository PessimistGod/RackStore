const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true,
    },
    price:{
        type: String,
        required: true,
    },
    days:{
        type:String,
        required: true,
    },
    image:{
        type:String,
        required:true
    }

},{timestamps:true})


mongoose.models = {}

const Product = mongoose.model('Product Details', productSchema)

module.exports = Product;