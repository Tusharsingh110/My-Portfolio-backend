const mongoose = require('mongoose');
const { schema } = require('./user.model');
const { Schema } = mongoose;

const OTPSchema = new Schema({
    otp: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }
});

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('otp', OTPSchema);
module.exports = OTP;
