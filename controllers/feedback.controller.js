const Feedback = require('../models/Feedback'); // Import your Feedback model
const { body, validationResult } = require('express-validator')

//get Feedbacks
async function getFeedbacks(req, res) {
    try {
        const feedbackData = req.results;
        if (!feedbackData) {
            res.status(400).json({ statusCode: 400, message: "No feedbacks found." })
        }
        // Send the feedback data as a JSON response
        res.status(200).json({ statusCode: 200, data: feedbackData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }

}

async function sendFeedback(req, res) {
    try {
        const feedback = req.body?.feedback;

        if (!feedback) {
            res.status(500).json({ statusCode: 500, message: "Feedback not found." })
        }

        const response = await Feedback.create(feedback);

        if (response)
            res.status(200).json({ statusCode: 200, message: "Feedback sent successfully" })

    } catch (error) {
        if (error.code === 11000) {
            // duplicate key error
            return res.status(500).json({ statusCode: 500, message:'E-mail already exists!' })
        }
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
}

module.exports = {
    getFeedbacks,
    sendFeedback
}
