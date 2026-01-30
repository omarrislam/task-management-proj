const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('../utils/ApiError');

const auth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError('Missing or invalid Authorization header', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user || !user.isActive) {
      return next(new ApiError('Not authorized', 401));
    }
    req.user = user;
    return next();
  } catch (err) {
    return next(new ApiError('Invalid or expired token', 401));
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError('Forbidden', 403));
  }
  return next();
};

module.exports = { auth, requireRole };
