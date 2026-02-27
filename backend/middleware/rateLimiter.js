import rateLimit from "express-rate-limit";
import { RATE, ERROR_CODES, HTTP } from "../config/constants.js";

const makeHandler = (msg) => (req, res) =>
  res.status(HTTP.TOO_MANY_REQUESTS).json({
    success: false,
    error: { code: ERROR_CODES.RATE_LIMIT_EXCEEDED, message: msg, details: [] },
    meta: { requestId: res.locals.requestId || null, timestamp: new Date().toISOString() },
  });

export const globalLimiter = rateLimit({ ...RATE.GLOBAL, standardHeaders: true, legacyHeaders: false, handler: makeHandler("Too many requests. Please slow down.") });
export const authLimiter = rateLimit({ ...RATE.AUTH, standardHeaders: true, legacyHeaders: false, handler: makeHandler("Too many login attempts. Try again in 15 minutes.") });
export const investLimiter = rateLimit({ ...RATE.INVEST, standardHeaders: true, legacyHeaders: false, handler: makeHandler("Investment rate limit exceeded. Please wait a moment.") });
export const adminLimiter = rateLimit({ ...RATE.ADMIN, standardHeaders: true, legacyHeaders: false, handler: makeHandler("Admin rate limit exceeded.") });
