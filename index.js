require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectToMongo = require('./db');
const initSocketServer = require('./socket');
const loggerUtils = require('./utils/logger.utils');

const feedbackRoutes = require('./routes/feedback.routes');
const userRoutes = require('./routes/user.routes');
const resumeRoutes = require('./routes/resume.routes');
const skillRoutes = require('./routes/skill.routes');

// Connect to MongoDB
connectToMongo();

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  const start = process.hrtime();
  const { method, url, body, params, headers } = req;

  const requestDetails = {
    method,
    url,
    params,
    body,
    query: req.query,
    headers,
    status: null,
    responseTime: null,
  };

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const responseTime = Math.ceil((diff[0] * 1e9 + diff[1]) / 1e6);
    requestDetails.status = res.statusCode;
    requestDetails.responseTime = responseTime;
    loggerUtils.logRequest(requestDetails);
  });

  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/feedbacks', feedbackRoutes);
app.use('/user', userRoutes);
app.use('/resume', resumeRoutes);
app.use('/skill', skillRoutes);

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).send({ error: 'Something went wrong. Please try again.' });
});

// Initialize socket server and get HTTP server
const server = initSocketServer(app);

// Start server on single port
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Modify graceful shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});

module.exports = app;