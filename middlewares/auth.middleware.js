const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/auth.utils');
require('dotenv').config();

// Middleware to authenticate token
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({statusCode:401, message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();  
  } catch (error) {
    res.status(401).json({statusCode:401, message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.isAdmin === 'T') {
    next();
  } else {
    res.status(403).json({statusCode:403, message: 'Forbidden' });
  }
};

module.exports = {
  authenticate,
  isAdmin
};
