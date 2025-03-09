const mongoose = require('mongoose');
const chatSessionModel = require('./chatSession.model');

const chatSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isAnswered: {
        type: Boolean,
        default: false
    },
    sessionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSession',
        required: true
    }
},
{ timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);