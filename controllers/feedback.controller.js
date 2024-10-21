const Feedback = require('../models/Feedback'); // Import your Feedback model
const { body, validationResult } = require('express-validator');
const { sendMail } = require('../utils/mailer.utils');

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
            res.status(400).json({ statusCode: 400, message: "Feedback not present." })
        }

        const recipientMail = {
            username: feedback.username,
            recepient: feedback.email,
            subject: 'Feedback Response',
        };

        const ownerMail = {
            username: process.env.DEFAULT_USERNAME,
            subject: 'Portfolio Response',
            data: `
                <div style={{"fontSize:'20px'"}}>
                <p>${feedback.username} says:</p>
                <strong>${feedback.message}</strong>
                <em>${feedback.collab ? '<p>PS: They also want to collaborate with you.</p>' : ''}</em>
                </div>
            `,
        };

        sendMail(recipientMail);
        sendMail(ownerMail);

        let response = {};
        if (feedback?.type !== "ask") response = await Feedback.create(feedback);

        res.status(200).json({ statusCode: 200, message: "Feedback sent successfully" })
    } catch (error) {
        // if (error.code === 11000) {
        //     // duplicate key error
        //     return res.status(400).json({ statusCode: 400, message: 'E-mail already exists!' })
        // }
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
}

module.exports = {
    getFeedbacks,
    sendFeedback
}
