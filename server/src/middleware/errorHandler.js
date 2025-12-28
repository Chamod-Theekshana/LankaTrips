// Express error-handling middleware must have 4 args: (err, req, res, next)
export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    data: null,
    message: err.message || 'Server error',
    // avoid leaking stack in prod
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
}
