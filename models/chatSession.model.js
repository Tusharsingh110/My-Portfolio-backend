const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionStartTimestamp: {
        type: Date,
        default: Date.now
    },
    sessionEndTimestamp: {
        type: Date
    },
    isSessionActive: {
        type: Boolean,
        default: true
    }
},
{ timestamps: true });

module.exports = mongoose.model('ChatSession', chatSessionSchema);