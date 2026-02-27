import express from "express";
import protect from "../middleware/auth.js";
import authorize from "../middleware/roles.js";
import { list, getById, create, update, remove } from "../controllers/projectController.js";

const router = express.Router();

router.get("/", protect, list);
router.get("/:id", protect, getById);
router.post("/", protect, authorize("admin"), create);
router.put("/:id", protect, authorize("admin"), update);
router.delete("/:id", protect, authorize("admin"), remove);

export default router;
