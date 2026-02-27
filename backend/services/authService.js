import crypto from "crypto";
import userRepo from "../repositories/userRepository.js";
import auditRepo from "../repositories/auditRepository.js";
import { setAuthCookie, clearAuthCookie, hashToken } from "../utils/tokens.js";
import { Errors } from "../utils/errors.js";
import { AUDIT, RESET_EXPIRY_MS } from "../config/constants.js";

const getMeta = (req) => ({ ip: req.ip, userAgent: req.get("user-agent") || "" });

const authService = {
  register: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw Errors.validation("name, email and password are required");
    if (password.length < 6) throw Errors.validation("Password must be at least 6 characters");

    const existing = await userRepo.findByEmailActive(email);
    if (existing) throw Errors.duplicate("Email");

    const user = await userRepo.create({ name, email, password });
    setAuthCookie(res, user._id);

    auditRepo.log(AUDIT.USER_REGISTERED, { userId: user._id, resourceId: user._id, resourceType: "User", ...getMeta(req), after: { name, email } });
    return user;
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw Errors.validation("Email and password are required");

    const user = await userRepo.findByEmail(email);
    if (!user) throw Errors.badCredentials();
    if (user.isLocked()) throw Errors.accountLocked(user.lockUntil);
    if (!user.isActive) throw Errors.forbidden("Account is deactivated");

    const valid = await user.matchPassword(password);
    if (!valid) {
      await user.incrementLoginAttempts();
      throw Errors.badCredentials();
    }

    await userRepo.updateLastLogin(user._id);
    setAuthCookie(res, user._id);

    auditRepo.log(AUDIT.USER_LOGIN, { userId: user._id, ...getMeta(req) });
    return user;
  },

  logout: async (req, res) => {
    clearAuthCookie(res);
    auditRepo.log(AUDIT.USER_LOGOUT, { userId: req.user._id, ...getMeta(req) });
  },

  forgotPassword: async (req) => {
    const { email } = req.body;
    const user = await userRepo.findByEmailActive(email);
    if (!user) return null;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashed = hashToken(rawToken);

    await userRepo.updateById(user._id, { passwordResetToken: hashed, passwordResetExpires: new Date(Date.now() + RESET_EXPIRY_MS) });
    console.log(`[AUTH] Password reset token for ${email}: ${rawToken}`);
    return rawToken;
  },

  resetPassword: async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) throw Errors.validation("Token and password are required");
    if (password.length < 6) throw Errors.validation("Password must be at least 6 characters");

    const hashed = hashToken(token);
    const user = await userRepo.findByResetToken(hashed);
    if (!user) throw Errors.validation("Invalid or expired reset token");

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    clearAuthCookie(res);
  },

  changePassword: async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) throw Errors.validation("Both passwords are required");
    if (newPassword.length < 6) throw Errors.validation("New password must be at least 6 characters");

    const user = await userRepo.findByEmail(req.user.email);
    const valid = await user.matchPassword(currentPassword);
    if (!valid) throw Errors.validation("Current password is incorrect");

    user.password = newPassword;
    await user.save();
    clearAuthCookie(res);

    auditRepo.log(AUDIT.PASSWORD_CHANGED, { userId: user._id, ...getMeta(req) });
  },

  updateProfile: async (req) => {
    const { name } = req.body;
    if (!name || name.trim().length < 2) throw Errors.validation("Name must be at least 2 characters");

    const user = await userRepo.updateById(req.user._id, { name: name.trim() });
    auditRepo.log(AUDIT.PROFILE_UPDATED, { userId: req.user._id, resourceId: req.user._id, resourceType: "User", ...getMeta(req), after: { name } });
    return user;
  },
};

export default authService;
