import express from "express";
import protect from "../middleware/auth.js";
import authorize from "../middleware/roles.js";
import { adminLimiter } from "../middleware/rateLimiter.js";
import { getAnalytics } from "../controllers/adminController.js";

const router = express.Router();

router.get("/analytics", protect, authorize("admin"), adminLimiter, getAnalytics);

export default router;
