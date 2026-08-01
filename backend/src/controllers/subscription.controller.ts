import { Request, Response } from "express";
import prisma from "../config/db";

export const toggleSubscribe = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const subscriberId = req.userId as string;

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
    });
    if (channel?.ownerId === subscriberId) {
      return res
        .status(400)
        .json({ message: "You cannot subscribe to your own channel." });
    }

    const existingSub = await prisma.subscription.findUnique({
      where: {
        subscriberId_channelId: { subscriberId, channelId },
      },
    });

    if (existingSub) {
      await prisma.subscription.delete({ where: { id: existingSub.id } });
      return res
        .status(200)
        .json({ message: "Unsubscribed.", subscribed: false });
    } else {
      await prisma.subscription.create({ data: { subscriberId, channelId } });
      return res.status(201).json({ message: "Subscribed!", subscribed: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getMySubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriberId = req.userId as string;

    const subscriptions = await prisma.subscription.findMany({
      where: { subscriberId },
      include: {
        channel: {
          select: {
            id: true,
            name: true,
            description: true,
            banner: true,
            ownerId: true,
            owner: {
              select: {
                avatar: true,
                name: true,
              },
            },
            _count: {
              select: {
                subscribers: true,
                videos: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const channels = subscriptions.map((sub) => sub.channel);
    return res.status(200).json({ subscriptions: channels });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

