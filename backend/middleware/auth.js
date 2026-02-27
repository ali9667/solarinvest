import User from "../models/User.js";
import { verifyToken } from "../utils/tokens.js";
import { failure } from "../utils/response.js";
import { ERROR_CODES, HTTP } from "../config/constants.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return failure(res, ERROR_CODES.AUTHENTICATION_REQUIRED, "Please log in to continue", HTTP.UNAUTHORIZED);
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive || user.deletedAt) return failure(res, ERROR_CODES.AUTHENTICATION_REQUIRED, "User not found or deactivated", HTTP.UNAUTHORIZED);
    req.user = user;
    res.locals.userId = user._id.toString();
    next();
  } catch (err) {
    return failure(res, err.code || ERROR_CODES.AUTHENTICATION_REQUIRED, err.message, err.statusCode || HTTP.UNAUTHORIZED);
  }
};

export default protect;
