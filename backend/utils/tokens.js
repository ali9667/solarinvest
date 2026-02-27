import jwt from "jsonwebtoken";
import crypto from "crypto";
import { TOKEN_EXPIRY } from "../config/constants.js";
import { Errors } from "./errors.js";

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") throw Errors.tokenExpired();
    throw Errors.tokenInvalid();
  }
};

export const setAuthCookie = (res, userId) => {
  const token = signToken(userId);
  res.cookie("accessToken", token, cookieOpts);
  return token;
};

export const clearAuthCookie = (res) => {
  res.clearCookie("accessToken", { httpOnly: true, secure: cookieOpts.secure, sameSite: cookieOpts.sameSite });
};

export const hashToken = (raw) =>
  crypto.createHash("sha256").update(raw).digest("hex");
