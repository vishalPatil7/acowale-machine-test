import { ApiError } from '../utils/ApiError.js';
import { isProd } from '../config/env.js';

// Centralized error handler -> single consistent JSON error shape:
// { error: { message, details? } }
// eslint-disable-next-line no-unused-vars -- Express needs the 4-arg signature
export const errorHandler = (err, req, res, next) => {
  const isApi = err instanceof ApiError;
  const statusCode = isApi ? err.statusCode : 500;

  if (statusCode >= 500) {
    req.log?.error({ err }, 'Unhandled error');
  }

  res.status(statusCode).json({
    error: {
      message: isApi || !isProd ? err.message : 'Internal server error',
      ...(isApi && err.details ? { details: err.details } : {}),
    },
  });
};
