const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Server error';

  if (process.env.NODE_ENV !== 'production') {
    return res.status(status).json({
      message,
      stack: err.stack,
    });
  }

  return res.status(status).json({ message });
};

module.exports = { errorHandler };
