import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Video } from "../types";
import { ThumbsUp } from "lucide-react";

const WatchVideo = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [video, setVideo] = useState<Video | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/videos/${id}`);
        setVideo(res.data.video);
        setLikeCount(res.data.video._count?.likes || 0);
      } catch (err) {
        console.error("The video failed to load:", err);
      }
    };
    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert("Please log in to like this video!");
    if (!video) return;

    try {
      const res = await api.post(`/likes/${video.id}`);
      setLiked(res.data.liked);
      setLikeCount((prev) => (res.data.liked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return alert("Please log in to subscribe!");
    if (!video?.channel) return;

    try {
      const res = await api.post(`/subscriptions/${video.channel.id}`);
      setSubscribed(res.data.subscribed);
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  if (!video) return <div className="loading-state">Loading video...</div>;

  const channelInitial = video.channel?.name
    ? video.channel.name.charAt(0).toUpperCase()
    : "C";

  return (
    <div className="watch-container">
      <div className="video-player-wrapper">
        <video src={video.videoUrl} controls autoPlay />
      </div>

      <h1 className="watch-title">{video.title}</h1>

      <div className="watch-header">
        <div className="channel-details">
          <Link to={`/channel/${video.channel?.id}`} className="channel-link">
            <div className="channel-avatar">{channelInitial}</div>
            <div className="channel-info">
              <div className="channel-name">{video.channel?.name || "Channel"}</div>
              <div className="sub-count">
                {(video.channel as any)?._count?.subscribers || 0} subscribers
              </div>
            </div>
          </Link>

          <button
            className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
            onClick={handleSubscribe}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        <div className="watch-actions">
          <button
            className={`like-btn ${liked ? "active" : ""}`}
            onClick={handleLike}
          >
            <ThumbsUp size={18} />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>

      <div className="watch-description-box">
        <div className="description-meta">
          <span>{video.views ?? 0} views</span>
        </div>
        {video.description ? (
          <p className="description-text">{video.description}</p>
        ) : (
          <p className="description-text no-desc">No description provided.</p>
        )}
      </div>
    </div>
  );
};

export default WatchVideo;
