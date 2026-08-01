import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";
import { Channel } from "../types";

const ChannelPage = () => {
  const { id } = useParams();
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await api.get(`/channels/${id}`);
        setChannel(res.data.channel);
      } catch (err) {
        console.error("Channel failed to load:", err);
      }
    };
    fetchChannel();
  }, [id]);

  if (!channel) return <div className="loading-state">Loading channel...</div>;

  return (
    <div>
      <div className="channel-header">
        <h1>{channel.name}</h1>
        <p style={{ color: "#606060", marginTop: 4, fontSize: 14 }}>
          {channel._count?.subscribers || 0} subscribers
        </p>
        {channel.description && (
          <p style={{ marginTop: 8, fontSize: 14 }}>{channel.description}</p>
        )}
      </div>

      <div className="video-grid">
        {channel.videos && channel.videos.length > 0 ? (
          channel.videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))
        ) : (
          <div className="empty-state">No videos found on this channel.</div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
