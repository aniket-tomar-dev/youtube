import { Request, Response } from "express";
import prisma from "../config/db";
export const addToHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required." });
    }

    const history = await prisma.watchHistory.upsert({
      where: {
        userId_videoId: { userId, videoId },
      },
      update: {
        watchedAt: new Date(),
      },
      create: {
        userId,
        videoId,
      },
    });

    return res.status(200).json({ message: "Added to history", history });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const search = req.query.search as string | undefined;

    const where: any = { userId };

    if (search && search.trim()) {
      where.video = {
        OR: [
          { title: { contains: search.trim(), mode: "insensitive" } },
          {
            channel: {
              name: { contains: search.trim(), mode: "insensitive" },
            },
          },
        ],
      };
    }

    const history = await prisma.watchHistory.findMany({
      where,
      orderBy: { watchedAt: "desc" },
      include: {
        video: {
          include: {
            channel: { select: { id: true, name: true } },
            _count: { select: { likes: true } },
          },
        },
      },
    });

    return res.status(200).json({ history });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const removeFromHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { videoId } = req.params;

    await prisma.watchHistory.deleteMany({
      where: { userId, videoId },
    });

    return res.status(200).json({ message: "Removed from history" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};
export const clearHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    await prisma.watchHistory.deleteMany({
      where: { userId },
    });

    return res.status(200).json({ message: "History cleared" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};
