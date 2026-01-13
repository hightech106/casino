/**
 * Async error handler wrapper for Express route handlers.
 * Automatically catches and forwards promise rejections to Express error middleware.
 * Prevents unhandled promise rejections in async route handlers.
 */
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;
