const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
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
    }
});

const User = mongoose.model('user', UserSchema);
// Feedback.createIndexes();
module.exports = User;