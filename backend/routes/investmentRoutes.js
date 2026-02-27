import express from "express";
import protect from "../middleware/auth.js";
import { investLimiter } from "../middleware/rateLimiter.js";
import { invest, withdraw, portfolio, transactions, exportCSV } from "../controllers/investmentController.js";

const router = express.Router();

router.post("/", protect, investLimiter, invest);
router.post("/:id/withdraw", protect, withdraw);
router.get("/portfolio", protect, portfolio);
router.get("/transactions", protect, transactions);
router.get("/export/csv", protect, exportCSV);

export default router;
