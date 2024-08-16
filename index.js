const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const feedbackRoutes = require('./routes/feedback.routes');
const userRoutes = require('./routes/user.routes');
const resumeRoutes = require('./routes/resume.routes')
connectToMongo();

const app = express();
const port = process.env.PORT;

app.get('/',(req,res)=> {
    res.send('Hello World')
})
// Middleware setup
app.use(cors())
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded
app.use(express.json({ limit: '10mb' }));  // Increase limit if necessary for larger files


app.use('/feedbacks', feedbackRoutes);
app.use('/user', userRoutes);
app.use('/resume', resumeRoutes);


app.listen(port, () => {
    console.log(`Example app listening at http://127.0.0.1:${port}`)
})