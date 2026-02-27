import { ERROR_CODES, HTTP } from "../config/constants.js";

const make = (message, code, statusCode, details = []) => {
  const err = new Error(message);
  err.code = code;
  err.statusCode = statusCode;
  err.details = details;
  err.isAppError = true;
  return err;
};

export const Errors = {
  notFound: (resource) => make(`${resource} not found`, ERROR_CODES.RESOURCE_NOT_FOUND, HTTP.NOT_FOUND),
  duplicate: (field) => make(`${field} already exists`, ERROR_CODES.DUPLICATE_RESOURCE, HTTP.CONFLICT),
  validation: (msg, details = []) => make(msg, ERROR_CODES.VALIDATION_FAILED, HTTP.UNPROCESSABLE, details),
  unauthorized: (msg = "Authentication required") => make(msg, ERROR_CODES.AUTHENTICATION_REQUIRED, HTTP.UNAUTHORIZED),
  tokenExpired: () => make("Session expired — please log in again", ERROR_CODES.TOKEN_EXPIRED, HTTP.UNAUTHORIZED),
  tokenInvalid: () => make("Invalid token", ERROR_CODES.TOKEN_INVALID, HTTP.UNAUTHORIZED),
  forbidden: (msg = "Access denied") => make(msg, ERROR_CODES.AUTHORIZATION_DENIED, HTTP.FORBIDDEN),
  accountLocked: (until) => make(`Account locked until ${new Date(until).toISOString()}`, ERROR_CODES.ACCOUNT_DEACTIVATED, HTTP.FORBIDDEN),
  badCredentials: () => make("Invalid email or password", ERROR_CODES.INVALID_CREDENTIALS, HTTP.UNAUTHORIZED),
  projectNotActive: () => make("Project is not accepting investments", ERROR_CODES.PROJECT_NOT_ACCEPTING, HTTP.BAD_REQUEST),
  alreadyWithdrawn: () => make("Investment already withdrawn", ERROR_CODES.INVESTMENT_ALREADY_WITHDRAWN, HTTP.BAD_REQUEST),
  internal: (msg = "Internal server error") => make(msg, ERROR_CODES.INTERNAL_ERROR, HTTP.INTERNAL),
};
