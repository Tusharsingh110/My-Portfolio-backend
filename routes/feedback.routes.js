const express = require('express');
const pagination = require('../middlewares/pagination');
const Feedback = require('../models/Feedback');
const feedbackController = require('../controllers/feedback.controller')
const router = express.Router();

router.post('/get-feedbacks',
     pagination(Feedback),
      feedbackController.getFeedbacks);

module.exports = router;