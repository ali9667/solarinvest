import logger from "../config/logger.js";
import { ERROR_CODES, HTTP } from "../config/constants.js";

const errorHandler = (err, req, res, next) => {
  const requestId = res.locals.requestId || null;

  logger.error(err.message, { requestId, code: err.code, path: req.path, userId: res.locals.userId || null });

  if (err.isAppError) {
    return res.status(err.statusCode).json({ success: false, error: { code: err.code, message: err.message, details: err.details || [] }, meta: { requestId, timestamp: new Date().toISOString() } });
  }

  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(HTTP.UNPROCESSABLE).json({ success: false, error: { code: ERROR_CODES.VALIDATION_FAILED, message: "Validation failed", details }, meta: { requestId, timestamp: new Date().toISOString() } });
  }

  if (err.name === "CastError") {
    return res.status(HTTP.BAD_REQUEST).json({ success: false, error: { code: ERROR_CODES.VALIDATION_FAILED, message: `Invalid ${err.path}`, details: [] }, meta: { requestId, timestamp: new Date().toISOString() } });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "Field";
    return res.status(HTTP.CONFLICT).json({ success: false, error: { code: ERROR_CODES.DUPLICATE_RESOURCE, message: `${field} already exists`, details: [] }, meta: { requestId, timestamp: new Date().toISOString() } });
  }

  return res.status(HTTP.INTERNAL).json({
    success: false,
    error: { code: ERROR_CODES.INTERNAL_ERROR, message: process.env.NODE_ENV === "production" ? "An unexpected error occurred" : err.message, details: [] },
    meta: { requestId, timestamp: new Date().toISOString() },
  });
};

export default errorHandler;
