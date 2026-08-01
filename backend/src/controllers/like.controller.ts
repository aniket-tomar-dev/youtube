import { Request, Response } from "express";
import prisma from "../config/db";

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId as string;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: { userId, videoId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return res.status(200).json({ message: "Like removed.", liked: false });
    } else {
      await prisma.like.create({ data: { userId, videoId } });
      return res.status(201).json({ message: "Video liked", liked: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};
