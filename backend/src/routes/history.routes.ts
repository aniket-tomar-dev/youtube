import { Router } from "express";
import {
  addToHistory,
  getHistory,
  removeFromHistory,
  clearHistory,
} from "../controllers/history.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, addToHistory);
router.get("/", authMiddleware, getHistory);
router.delete("/clear", authMiddleware, clearHistory);
router.delete("/:videoId", authMiddleware, removeFromHistory);

export default router;
