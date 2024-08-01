const Feedback = require('../models/Feedback'); // Import your Feedback model
const { body, validationResult } = require('express-validator')

//get Feedbacks
async function getFeedbacks (req, res) {
    try {
        const feedbackData = req.results;
        console.log(feedbackData);
        if (!feedbackData) {
            res.status(400).json({ statusCode: 400, message: "No feedbacks found." })
        }
        // Send the feedback data as a JSON response
        res.status(200).json({ statusCode: 200, data: feedbackData });
        // console.log(feedbackData)
    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }

}

// router.post('/', [
//     body('username', 'Enter a valid username').isLength({ min: 3 }),
//     body('email', 'Enter a valid email').isEmail(),
// ], async (req, res) => {
//     // console.log(req.body)
//     // const feedback  = Feedback(req.body)
//     // feedback.save()
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//         const feedback = await Feedback.create({
//             username: req.body.username,
//             email: req.body.email,
//             type: req.body.type,
//             collab: req.body.collab,
//             message: req.body.message
//         });
//         res.json(feedback);
//         // console.log(res);
//     }
//     catch (error) {
//         if (error.code === 11000) {
//             // duplicate key error
//             return res.status(400).json({ error: 'E-mail already exists!' })
//         }
//         console.log(error);
//         res.status(500).json({ error: 'Server error!' });
//     }
// })


module.exports = {
    getFeedbacks
}
