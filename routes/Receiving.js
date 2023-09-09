const express = require('express');
const Feedback = require('../models/Feedback'); // Import your Feedback model

const router = express.Router();

// Define a GET route for receiving feedback data
router.get('/', async (req, res) => {
  try {
    // Retrieve all feedback data from the database
    const feedbackData = await Feedback.find({ type: 'feedback' });

    // Send the feedback data as a JSON response
    res.json(feedbackData);
    // console.log(feedbackData)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
