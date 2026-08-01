import { Request, Response } from "express";
import prisma from "../config/db";

export const createChannel = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.userId;

    if (!name) {
      return res.status(400).json({ message: "Channel name is required." });
    }

    const existingChannel = await prisma.channel.findUnique({
      where: { ownerId: userId },
    });
    if (existingChannel) {
      return res.status(400).json({ message: "You already have a channel." });
    }

    const channel = await prisma.channel.create({
      data: {
        name,
        description,
        ownerId: userId as string,
      },
    });

    return res.status(201).json({ message: "Channel Created", channel });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getChannelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const channel = await prisma.channel.findUnique({
      where: { id },
      include: {
        videos: { orderBy: { createdAt: "desc" } },
        _count: { select: { subscribers: true } },
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    return res.status(200).json({ channel });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};
