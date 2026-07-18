import { ApiError } from '../utils/ApiError.js';

// Validates and coerces req[part] against a Zod schema, storing the parsed
// result on req.validated[part]. Keeps controllers free of parsing logic.
export const validate = (schema, part = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[part]);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join('.') || part,
      message: i.message,
    }));
    return next(ApiError.badRequest('Validation failed', details));
  }
  req.validated = req.validated ?? {};
  req.validated[part] = result.data;
  next();
};
