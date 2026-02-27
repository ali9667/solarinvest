import authService from "../services/authService.js";
import { success } from "../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req, res);
    return success(res, { user: user.toSafeObject() }, 201);
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const user = await authService.login(req, res);
    return success(res, { user: user.toSafeObject() });
  } catch (err) { next(err); }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req, res);
    return success(res, { message: "Logged out successfully" });
  } catch (err) { next(err); }
};

export const getMe = (req, res) => success(res, { user: req.user.toSafeObject() });

export const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req);
    return success(res, { message: "If that email exists, a reset link has been sent." });
  } catch (err) { next(err); }
};

export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req, res);
    return success(res, { message: "Password reset successful. Please log in." });
  } catch (err) { next(err); }
};

export const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req, res);
    return success(res, { message: "Password changed. Please log in again." });
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req);
    return success(res, { user: user.toSafeObject() });
  } catch (err) { next(err); }
};
