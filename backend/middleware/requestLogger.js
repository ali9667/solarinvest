import crypto from "crypto";
import logger from "../config/logger.js";

const requestLogger = (req, res, next) => {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  res.locals.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  res.on("finish", () => {
    const ms = Date.now() - start;
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "http";
    logger[level](`${req.method} ${req.path} ${res.statusCode} ${ms}ms`, { requestId, userId: res.locals.userId || null });
  });

  next();
};

export default requestLogger;
