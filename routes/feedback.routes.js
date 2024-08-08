const express = require('express');
const pagination = require('../middlewares/pagination');
const Feedback = require('../models/Feedback');
const feedbackController = require('../controllers/feedback.controller')
const router = express.Router();

router.post('/get-feedbacks', pagination(Feedback), feedbackController.getFeedbacks);
router.post('/send-feedback', feedbackController.sendFeedback);
module.exports = router;