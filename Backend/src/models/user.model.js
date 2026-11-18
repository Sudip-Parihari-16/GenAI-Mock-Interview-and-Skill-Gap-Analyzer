const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true,"username already exists"],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "email already exists with this email"]
    },
    password: {
        type: String,
        required: true
    }
});


const userModel = mongoose.model('User', userSchema);
module.exports = userModel;