import { Request, Response } from "express";
import prisma from "../config/db";

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category } = req.body;

    const userId = req.userId;

    if (!title) {
      return res.status(400).json({
        message: "It is necessary to give the video a title",
      });
    }

    if (!videoUrl) {
      return res.status(400).json({
        message: "Video URL is required.",
      });
    }

    const channel = await prisma.channel.findUnique({
      where: { ownerId: userId },
    });

    if (!channel) {
      return res.status(400).json({
        message: "First, create your channel, then upload videos.",
      });
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnailUrl: thumbnailUrl || null,
        category: category || "All",
        channelId: channel.id,
      },
    });

    return res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error.",
    });
  }
};
export const getAllVideos = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;

    const where = category && category !== "All" ? { category } : {};

    const videos = await prisma.video.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        channel: { select: { id: true, name: true } },
        _count: { select: { likes: true } },
      },
    });
    const allVideos = await prisma.video.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    const categories = [
      "All",
      ...allVideos
        .map((v: { category: string }) => v.category)
        .filter((c: string) => c !== "All"),
    ];

    return res.status(200).json({ videos, categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await prisma.video.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        channel: { select: { id: true, name: true } },
        _count: { select: { likes: true } },
      },
    });
    if (req.userId) {
      try {
        await prisma.watchHistory.upsert({
          where: {
            userId_videoId: { userId: req.userId, videoId: id },
          },
          update: { watchedAt: new Date() },
          create: { userId: req.userId, videoId: id },
        });
      } catch (historyErr) {
        console.error("Failed to track history:", historyErr);
      }
    }

    return res.status(200).json({ video });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Video not found." });
  }
};

export const searchVideosAndChannels = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string)?.trim();

    if (!q) {
      return res.status(400).json({ message: "Search input is required." });
    }

    const [videos, channels] = await Promise.all([
      prisma.video.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            {
              channel: { name: { contains: q, mode: "insensitive" } },
            },
          ],
        },
        include: {
          channel: { select: { id: true, name: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { views: "desc" },
        take: 30,
      }),
      prisma.channel.findMany({
        where: {
          name: { contains: q, mode: "insensitive" },
        },
        select: {
          id: true,
          name: true,
          description: true,
          banner: true,
          ownerId: true,
          _count: { select: { subscribers: true, videos: true } },
        },
        take: 10,
      }),
    ]);

    return res.status(200).json({ videos, channels });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};
