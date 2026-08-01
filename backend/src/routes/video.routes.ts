import { Router } from "express";
import {
  uploadVideo,
  getAllVideos,
  getVideoById,
  searchVideosAndChannels,
} from "../controllers/video.controller";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.middleware";
// import { uploadVideoFiles } from "../middleware/upload.middleware";

const router = Router();

router.post("/", authMiddleware, uploadVideo);

router.get("/", getAllVideos);
router.get("/search", searchVideosAndChannels);
router.get("/:id", optionalAuthMiddleware, getVideoById);

export default router;
