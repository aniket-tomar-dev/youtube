import { useNavigate } from "react-router-dom";
import { Video } from "../types";

const VideoCard = ({ video }: { video: Video }) => {
  const navigate = useNavigate();

  const thumbnailSrc =
    video.thumbnailUrl ?? "https://placehold.co/320x180?text=No+Thumbnail";

  const channelInitial = video.channel?.name
    ? video.channel.name.charAt(0).toUpperCase()
    : "C";

  return (
    <div className="video-card" onClick={() => navigate(`/watch/${video.id}`)}>
      <div className="thumbnail-container">
        <img className="thumbnail" src={thumbnailSrc} alt={video.title} />
      </div>
      <div className="video-info">
        <div className="channel-avatar">
          {channelInitial}
        </div>
        <div className="video-details">
          <h3 className="title" title={video.title}>
            {video.title}
          </h3>
          <div className="channel-name">
            {video.channel?.name || "Channel"}
          </div>
          <div className="meta">
            {video.views ?? 0} views
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
