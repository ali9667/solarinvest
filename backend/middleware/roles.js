import { failure } from "../utils/response.js";
import { ERROR_CODES, HTTP } from "../config/constants.js";

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return failure(res, ERROR_CODES.AUTHORIZATION_DENIED, "Insufficient permissions", HTTP.FORBIDDEN);
  }
  next();
};

export default authorize;
