import express from "express";
import protect from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { register, login, logout, getMe, forgotPassword, resetPassword, changePassword, updateProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
