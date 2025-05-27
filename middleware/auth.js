require('dotenv').config();
const jwt = require('jsonwebtoken');
const Staff = require('../model/staff');

const secretKey = process.env.JWT_SECRET_KEY || 'yoursecretKey';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(403).json({ message: 'Token required' });

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // id and role will be here
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
  

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
