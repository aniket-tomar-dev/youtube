import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Video } from "../types";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  FolderPlus,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return Math.floor(seconds) + " seconds ago";
}

const WatchVideo = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/videos/${id}`);
        setVideo(res.data.video);
        setLikeCount(res.data.video._count?.likes || 0);

        const relatedRes = await api.get("/videos");
        if (relatedRes.data && relatedRes.data.videos) {
          setRelatedVideos(
            relatedRes.data.videos.filter((v: Video) => v.id !== id),
          );
        }
      } catch (err) {
        console.error("The video failed to load:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
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

  if (loading) return <div className="loading-state">Loading video...</div>;
  if (!video) return <div className="loading-state">Video not found.</div>;

  const channelInitial = video.channel?.name
    ? video.channel.name.charAt(0).toUpperCase()
    : "C";

  return (
    <div className="watch-page">
      <div className="watch-main">
        <div className="watch-player">
          <video src={video.videoUrl} controls autoPlay />
        </div>

        <h1 className="watch-video-title">{video.title}</h1>

        <div className="watch-meta-row">
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link
              to={`/channel/${video.channel?.id}`}
              className="watch-channel-link"
              style={{ flex: "none" }}
            >
              <div className="watch-channel-avatar">{channelInitial}</div>
              <div className="watch-channel-info">
                <div className="watch-channel-name">
                  {video.channel?.name || "Channel"}
                </div>
                <div className="watch-subs">
                  {(video.channel as any)?._count?.subscribers || 0} subscribers
                </div>
              </div>
            </Link>

            <button
              className={`watch-subscribe-btn ${subscribed ? "subscribed" : ""}`}
              onClick={handleSubscribe}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          <div style={{ flex: 1 }}></div>

          <div className="watch-actions-row">
            <div className="watch-like-group">
              <button
                className={`watch-like-btn ${liked ? "liked" : ""}`}
                onClick={handleLike}
              >
                <ThumbsUp size={18} />
                <span>
                  {likeCount >= 1000
                    ? (likeCount / 1000).toFixed(1) + "K"
                    : likeCount}
                </span>
              </button>
              <div className="watch-like-divider" />
              <button className="watch-dislike-btn">
                <ThumbsDown size={18} />
              </button>
            </div>

            <button className="watch-share-btn">
              <Share2 size={18} />
              <span>Share</span>
            </button>

            <button className="watch-share-btn">
              <FolderPlus size={18} />
              <span>Save</span>
            </button>

            <button className="watch-share-btn" style={{ padding: "0 10px" }}>
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="watch-description-box">
          <div className="description-meta">
            <span>
              {video.views ?? 0} views • {formatTimeAgo(video.createdAt)}
            </span>
          </div>
          <p
            className={
              video.description
                ? "description-text"
                : "description-text no-desc"
            }
          >
            {video.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="watch-sidebar">
        <div
          className="category-chips-wrapper"
          style={{ marginBottom: "16px", paddingBottom: "2px" }}
        >
          <button className="category-chip active">All</button>
          {video.channel?.name && (
            <button className="category-chip">
              From {video.channel.name.split(" ")[0]}
            </button>
          )}
          <button className="category-chip">Similar</button>
          <button className="category-chip">Recently uploaded</button>
        </div>

        <div className="watch-related-list">
          {relatedVideos.length === 0 ? (
            <div className="watch-no-related">No related videos found.</div>
          ) : (
            relatedVideos.map((rv) => (
              <Link key={rv.id} to={`/watch/${rv.id}`} className="related-card">
                <div className="related-thumb">
                  <img
                    src={
                      rv.thumbnailUrl ||
                      `https://picsum.photos/seed/${rv.id}/300/170`
                    }
                    alt={rv.title}
                  />
                </div>
                <div className="related-info">
                  <h3 className="related-title">{rv.title}</h3>
                  <div className="related-channel">
                    <span className="related-channel-name">
                      {rv.channel?.name || "Channel"}
                    </span>
                    <CheckCircle2 size={12} className="text-gray-500" />
                  </div>
                  <div className="related-meta">
                    {rv.views || 0} views • {formatTimeAgo(rv.createdAt)}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
