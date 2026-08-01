import { Router } from "express";
import {
  toggleSubscribe,
  getMySubscriptions,
} from "../controllers/subscription.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, getMySubscriptions);
router.get("/", authMiddleware, getMySubscriptions);
router.post("/:channelId", authMiddleware, toggleSubscribe);

export default router;

