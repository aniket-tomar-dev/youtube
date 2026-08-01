export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  channel?: Channel | null;
}

export interface Channel {
  id: string;
  name: string;
  description?: string | null;
  banner?: string | null;
  ownerId: string;
  videos?: Video[];
  _count?: { subscribers: number; videos?: number };
}

export interface Video {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  thumbnailUrl?: string | null;
  category?: string;
  views: number;
  createdAt: string;
  channelId: string;
  channel?: { id: string; name: string };
  _count?: { likes: number };
}
