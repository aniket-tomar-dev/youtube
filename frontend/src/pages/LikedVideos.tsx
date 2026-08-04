import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, MoreVertical, Play, Shuffle, Search } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const pageContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - var(--yt-header-height))",
  background: "var(--yt-bg)",
  color: "var(--yt-text-primary)",
};

const contentWrapper: React.CSSProperties = {
  display: "flex",
  flex: 1,
  padding: "24px",
  gap: "24px",
  maxWidth: "1400px",
  margin: "0 auto",
  width: "100%",
};

const playlistInfoSide: React.CSSProperties = {
  width: "360px",
  minWidth: "360px",
  background: "linear-gradient(to bottom, #d4d4d4 0%, var(--yt-bg) 100%)",
  borderRadius: "24px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  position: "sticky",
  top: "80px",
  height: "calc(100vh - 100px)",
};

const videoListSide: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const emptyState: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 24px",
  textAlign: "center",
  color: "var(--yt-text-secondary)",
  gap: "12px",
  width: "100%",
};

const loginBtn: React.CSSProperties = {
  padding: "10px 24px",
  borderRadius: "20px",
  background: "var(--yt-blue-btn)",
  color: "#ffffff",
  fontWeight: 600,
  fontSize: "14px",
  border: "none",
  cursor: "pointer",
};

const LikedVideos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLikedVideos = async () => {
      try {
        const res = await api.get("/likes");
        setLikes(res.data.likes);
      } catch (err) {
        console.error("Failed to fetch liked videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, [user]);

  if (!user) {
    return (
      <div style={pageContainer}>
        <div style={emptyState}>
          <Search
            size={48}
            strokeWidth={1.5}
            color="var(--yt-text-secondary)"
          />
          <p
            style={{
              fontSize: "18px",
              color: "var(--yt-text-primary)",
              fontWeight: 500,
            }}
          >
            Keep track of what you like
          </p>
          <p style={{ fontSize: "14px", maxWidth: "400px" }}>
            Liked videos aren't viewable when signed out.
          </p>
          <button style={loginBtn} onClick={() => navigate("/login")}>
            Sign in
          </button>
        </div>
      </div>
    );
  }

  const firstLikedVideo = likes.length > 0 ? likes[0].video : null;
  const thumbnailSrc =
    firstLikedVideo?.thumbnailUrl ||
    "https://placehold.co/400x225/272727/aaa?text=Liked+videos";
  const updatedDate =
    likes.length > 0
      ? new Date(likes[0].createdAt).toLocaleDateString()
      : "No videos yet";

  return (
    <div style={pageContainer}>
      <div style={contentWrapper} className="flex-col md:flex-row">
        {/* Left Side: Playlist Info */}
        <div
          style={{
            ...playlistInfoSide,
            background: `linear-gradient(to bottom, var(--yt-active-bg) 0%, var(--yt-bg) 100%)`,
          }}
        >
          <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 shadow-lg">
            <img
              src={thumbnailSrc}
              alt="Liked Videos Playlist"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-[28px] font-bold text-var(--yt-text-primary) mb-4">
            Liked videos
          </h1>
          <div className="text-[14px] font-medium text-var(--yt-text-primary) mb-1">
            {user?.name}
          </div>
          <div className="text-[12px] text-var(--yt-text-secondary) mb-4">
            {likes.length} videos • No views • Last updated on {updatedDate}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <button className="w-10 h-10 rounded-full bg-var(--yt-active-bg) flex items-center justify-center hover:bg-(--yt-hover-bg) ext-(--yt-text-primary)">
              <Download size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-var(--yt-active-bg) flex items-center justify-center hover:bg-(--yt-hover-bg) text-(--yt-text-primary)">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 h-9 rounded-full bg-var(--yt-text-primary) text-var(--yt-bg) font-medium flex items-center justify-center gap-2 hover:opacity-90">
              <Play size={18} fill="currentColor" /> Play all
            </button>
            <button className="flex-1 h-9 rounded-full bg-(--yt-active-bg) text-(--yt-text-primary) font-medium flex items-center justify-center gap-2 hover:bg-(--yt-hover-bg)">
              <Shuffle size={18} /> Shuffle
            </button>
          </div>
        </div>

        {/* Right Side: Videos List */}
        <div style={videoListSide}>
          {loading ? (
            <div className="p-8 text-center text-(--yt-text-secondary)">
              Loading...
            </div>
          ) : likes.length === 0 ? (
            <div className="p-8 text-center text-(--yt-text-secondary)">
              No liked videos found.
            </div>
          ) : (
            likes.map((likeItem, index) => {
              const video = likeItem.video;
              return (
                <div
                  key={likeItem.id}
                  className="flex gap-4 p-2 rounded-xl hover:bg-(--yt-hover-bg) cursor-pointer transition-colors group relative items-center"
                  onClick={() => navigate(`/watch/${video.id}`)}
                >
                  <span className="text-(--yt-text-secondary) text-sm font-medium w-4 text-center">
                    {index + 1}
                  </span>

                  <div className="w-40 min-w-40 aspect-video rounded-lg overflow-hidden bg-(--yt-active-bg) relative">
                    <img
                      src={
                        video.thumbnailUrl ||
                        "https://placehold.co/160x90/272727/aaa?text=Thumb"
                      }
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0 pr-8">
                    <h3 className="text-[16px] font-medium text-(--yt-text-primary) line-clamp-2 mb-1">
                      {video.title}
                    </h3>
                    <div className="text-[13px] text-(--yt-text-secondary) flex items-center gap-2">
                      <span className="hover:text-(--yt-text-primary)">
                        {video.channel?.name || "Channel"}
                      </span>
                      <span>•</span>
                      <span>{video.views} views</span>
                    </div>
                  </div>

                  <button
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-(--yt-active-bg) text-(--yt-text-primary)transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      // More options logic here
                    }}
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .flex-col.md:flex-row {
            flex-direction: column !important;
          }
          [style*="width: 360px"] {
            width: 100% !important;
            min-width: 100% !important;
            height: auto !important;
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LikedVideos;
