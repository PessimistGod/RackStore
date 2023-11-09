const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    isAdmin:{
        type:Boolean,
        default:false
    }

},{timestamps:true})


mongoose.models = {}

const User = mongoose.model('User Details', userSchema)

module.exports = User;