import { Router } from "express";
import { toggleLike, getLikedVideos } from "../controllers/like.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getLikedVideos);
router.post("/:videoId", authMiddleware, toggleLike);

export default router;
