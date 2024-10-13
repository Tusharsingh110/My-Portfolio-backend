const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    isAdmin: {
        type: String,
        required: true,
        default: "F"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,  
        required: true,
        default: false
    }
});

const User = mongoose.model('user', UserSchema);
// Feedback.createIndexes();
module.exports = User;