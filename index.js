const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const feedbackRoutes = require('./routes/feedback.routes');
const userRoutes = require('./routes/user.routes');
const resumeRoutes = require('./routes/resume.routes');
const skillRoutes = require('./routes/skill.routes');
const loggerUtils = require('./utils/logger.utils');
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
// Custom logging middleware
app.use((req, res, next) => {
    const start = process.hrtime(); // Start time
    const { method, url, body, params, headers } = req;
  
    // Capture request details before processing
    const requestDetails = {
      method,
      url,
      params: req.params,
      body: req.body,
      query: req.query,
      headers: req.headers,
      status: null,
      responseTime: null,
    };
  
    // Capture response details after processing
    res.on('finish', () => {
      const diff = process.hrtime(start);
      const responseTime = (diff[0] * 1e9 + diff[1]) / 1e6; // Convert to milliseconds
      requestDetails.status = res.statusCode;
      requestDetails.responseTime = responseTime;
  
      // Log request and response details
      loggerUtils.logRequest(requestDetails);
    });
  
    next(); // Continue to the next middleware
  });


app.use('/feedbacks', feedbackRoutes);
app.use('/user', userRoutes);
app.use('/resume', resumeRoutes);
app.use('/skill', skillRoutes);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})