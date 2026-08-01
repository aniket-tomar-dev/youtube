import { Router } from "express";
import { toggleLike } from "../controllers/like.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/:videoId", authMiddleware, toggleLike);

export default router;
