// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    is_active: { type: Boolean, default: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);