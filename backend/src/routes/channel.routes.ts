import { Router } from "express";
import { createChannel, getChannelById } from "../controllers/channel.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createChannel);

router.get("/:id", getChannelById);

export default router;
