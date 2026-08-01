import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Video } from "../types";
import api from "../api/axios";
import {
  Search,
  Trash2,
  Pause,
  Settings,
  MessageSquare,
  FileText,
  Radio,
  MoreVertical,
  X,
} from "lucide-react";

interface HistoryEntry {
  id: string;
  watchedAt: string;
  video: Video;
}

const pageContainer: React.CSSProperties = {
  display: "flex",
  gap: "0",
  minHeight: "calc(100vh - 56px)",
  fontFamily: '"Roboto", "Segoe UI", Arial, sans-serif',
  background: "#f1f1f1",
  color: "#0f0f0f",
};

const mainSection: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: "24px 24px 40px 24px",
  maxWidth: "900px",
};

const pageTitle: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: 700,
  color: "#0f0f0f",
  marginBottom: "20px",
  letterSpacing: "-0.5px",
};

const chipsWrapper: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  overflowX: "auto",
  marginBottom: "32px",
  paddingBottom: "4px",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const chipBase: React.CSSProperties = {
  flexShrink: 0,
  padding: "0 12px",
  height: "32px",
  borderRadius: "8px",
  border: "none",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: "all 0.15s ease",
  fontFamily: "inherit",
};

const chipInactive: React.CSSProperties = {
  ...chipBase,
  background: "rgba(255,255,255,0.1)",
  color: "#0f0f0f",
};

const chipActive: React.CSSProperties = {
  ...chipBase,
  background: "#0f0f0f",
  color: "#f1f1f1",
  fontWeight: 600,
};

const dateHeading: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#0f0f0f",
  marginBottom: "16px",
  marginTop: "8px",
};

const videoRow: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  marginBottom: "16px",
  cursor: "pointer",
  borderRadius: "12px",
  padding: "8px",
  transition: "background 0.15s ease",
  position: "relative",
};

const thumbnailContainer: React.CSSProperties = {
  width: "240px",
  minWidth: "240px",
  aspectRatio: "16/9",
  borderRadius: "12px",
  overflow: "hidden",
  background: "#272727",
  position: "relative",
  flexShrink: 0,
};

const thumbnailImg: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  transition: "transform 0.2s ease",
};

const videoInfo: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  minWidth: 0,
  paddingTop: "2px",
};

const videoTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 500,
  color: "#0f0f0f",
  lineHeight: 1.4,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  margin: 0,
};

const channelLine: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  marginTop: "6px",
  fontSize: "13px",
  color: "#aaa",
};

const verifiedBadge: React.CSSProperties = {
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  background: "#aaa",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "8px",
  color: "#f1f1f1",
  fontWeight: 700,
};

const viewsLine: React.CSSProperties = {
  fontSize: "13px",
  color: "#aaa",
  marginTop: "2px",
};

const descLine: React.CSSProperties = {
  fontSize: "13px",
  color: "#aaa",
  marginTop: "8px",
  lineHeight: 1.4,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const moreBtn: React.CSSProperties = {
  position: "absolute",
  top: "8px",
  right: "8px",
  background: "none",
  border: "none",
  color: "#0f0f0f",
  cursor: "pointer",
  padding: "4px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.15s",
};

// --- Right Sidebar Styles ---

const sidebarRight: React.CSSProperties = {
  width: "300px",
  minWidth: "300px",
  padding: "24px 24px 24px 0",
  display: "flex",
  flexDirection: "column",
  gap: "0",
};

const searchBox: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  paddingBottom: "20px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  marginBottom: "16px",
};

const searchInput: React.CSSProperties = {
  flex: 1,
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(255,255,255,0.3)",
  color: "#0f0f0f",
  fontSize: "14px",
  padding: "8px 0",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
};

const sidebarItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "12px 8px",
  fontSize: "14px",
  color: "#0f0f0f",
  cursor: "pointer",
  borderRadius: "8px",
  transition: "background 0.15s",
  border: "none",
  background: "none",
  width: "100%",
  textAlign: "left",
  fontFamily: "inherit",
};

const sidebarDivider: React.CSSProperties = {
  height: "1px",
  background: "rgba(255,255,255,0.1)",
  margin: "8px 0",
};

const sidebarTabItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "10px 8px",
  fontSize: "14px",
  color: "#aaa",
  cursor: "pointer",
  borderRadius: "8px",
  transition: "background 0.15s, color 0.15s",
  border: "none",
  background: "none",
  width: "100%",
  textAlign: "left",
  fontFamily: "inherit",
};

const emptyState: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 24px",
  textAlign: "center",
  color: "#aaa",
  gap: "12px",
};

const loginPrompt: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 24px",
  textAlign: "center",
  color: "#aaa",
  gap: "16px",
};

const loginBtn: React.CSSProperties = {
  padding: "10px 24px",
  borderRadius: "20px",
  background: "#3ea6ff",
  color: "#f1f1f1",
  fontWeight: 600,
  fontSize: "14px",
  border: "none",
  cursor: "pointer",
  transition: "opacity 0.15s",
};

const loadingStyle: React.CSSProperties = {
  padding: "60px 24px",
  textAlign: "center",
  color: "#aaa",
  fontSize: "15px",
};

// --- Helper functions ---

function groupByDate(entries: HistoryEntry[]): Record<string, HistoryEntry[]> {
  const groups: Record<string, HistoryEntry[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (const entry of entries) {
    const watchDate = new Date(entry.watchedAt);
    const entryDay = new Date(
      watchDate.getFullYear(),
      watchDate.getMonth(),
      watchDate.getDate(),
    );

    let label: string;
    const diffDays = Math.floor(
      (today.getTime() - entryDay.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      label = "Today";
    } else if (diffDays === 1) {
      label = "Yesterday";
    } else if (diffDays < 7) {
      label = dayNames[watchDate.getDay()];
    } else {
      label = `${monthNames[watchDate.getMonth()]} ${watchDate.getDate()}, ${watchDate.getFullYear()}`;
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(entry);
  }

  return groups;
}

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K views`;
  return `${views} views`;
}

// --- Component ---

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [activeChip, setActiveChip] = useState("All");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredSidebar, setHoveredSidebar] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const CHIPS = ["All", "Videos", "Shorts", "Podcasts", "Music"];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (searchQuery.trim()) params.search = searchQuery.trim();
        const res = await api.get("/history", { params });
        setEntries(res.data.history || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, searchQuery]);

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all watch history?"))
      return;
    try {
      await api.delete("/history/clear");
      setEntries([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const handleRemove = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/history/${videoId}`);
      setEntries((prev) => prev.filter((entry) => entry.video.id !== videoId));
    } catch (err) {
      console.error("Failed to remove from history:", err);
    }
  };

  const handleSearch = () => {
    setSearchActive(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  // Not logged in
  if (!user) {
    return (
      <div style={pageContainer}>
        <div style={mainSection}>
          <h1 style={pageTitle}>Watch history</h1>
          <div style={loginPrompt}>
            <Search size={48} strokeWidth={1.5} color="#aaa" />
            <p style={{ fontSize: "18px", color: "#0f0f0f", fontWeight: 500 }}>
              Keep track of what you watch
            </p>
            <p style={{ fontSize: "14px", color: "#aaa", maxWidth: "400px" }}>
              Watch history isn't viewable when signed out.
            </p>
            <button style={loginBtn} onClick={() => navigate("/login")}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  const grouped = groupByDate(entries);

  return (
    <div style={pageContainer} id="history-page">
      <div style={mainSection}>
        <h1 style={pageTitle}>Watch history</h1>

        <div style={chipsWrapper}>
          {CHIPS.map((chip) => (
            <button
              key={chip}
              style={activeChip === chip ? chipActive : chipInactive}
              onClick={() => setActiveChip(chip)}
              onMouseEnter={(e) => {
                if (activeChip !== chip)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                if (activeChip !== chip)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.1)";
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={loadingStyle}>Loading history...</div>
        ) : entries.length === 0 ? (
          <div style={emptyState}>
            <Search size={48} strokeWidth={1.5} color="#555" />
            <p style={{ fontSize: "16px", color: "#0f0f0f", fontWeight: 500 }}>
              {searchQuery ? "No results found" : "No watch history yet"}
            </p>
            <p style={{ fontSize: "14px", color: "#aaa" }}>
              {searchQuery
                ? "Try different keywords"
                : "Videos that you watch will show up here"}
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([dateLabel, items]) => (
            <div key={dateLabel} style={{ marginBottom: "32px" }}>
              <h2 style={dateHeading}>{dateLabel}</h2>
              {items.map((entry) => {
                const video = entry.video;
                const isHovered = hoveredRow === entry.id;
                const thumbnailSrc =
                  video.thumbnailUrl ??
                  "https://placehold.co/320x180/272727/aaa?text=No+Thumbnail";
                const channelInitial =
                  video.channel?.name?.charAt(0)?.toUpperCase() || "C";

                return (
                  <div
                    key={entry.id}
                    style={{
                      ...videoRow,
                      background: isHovered
                        ? "rgba(255,255,255,0.05)"
                        : "transparent",
                    }}
                    onMouseEnter={() => setHoveredRow(entry.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => navigate(`/watch/${video.id}`)}
                  >
                    {/* Thumbnail */}
                    <div style={thumbnailContainer}>
                      <img
                        style={{
                          ...thumbnailImg,
                          transform: isHovered ? "scale(1.03)" : "scale(1)",
                        }}
                        src={thumbnailSrc}
                        alt={video.title}
                      />
                      {/* Duration badge placeholder */}
                      {video.category && video.category === "Shorts" && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "8px",
                            left: "8px",
                            background: "rgba(0,0,0,0.8)",
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          ⚡ SHORTS
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={videoInfo}>
                      <h3 style={videoTitle}>{video.title}</h3>
                      <div style={channelLine}>
                        <span>{video.channel?.name || "Channel"}</span>
                        <span style={verifiedBadge}>✓</span>
                        <span>•</span>
                        <span>{formatViews(video.views ?? 0)}</span>
                      </div>
                      {video.description && (
                        <p style={descLine}>{video.description}</p>
                      )}
                    </div>

                    {/* More options / Remove button */}
                    {isHovered && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <button
                          style={{
                            ...moreBtn,
                            position: "relative",
                            top: "auto",
                            right: "auto",
                          }}
                          onClick={(e) => handleRemove(video.id, e)}
                          title="Remove from history"
                        >
                          <X size={18} />
                        </button>
                        <button
                          style={{
                            ...moreBtn,
                            position: "relative",
                            top: "auto",
                            right: "auto",
                          }}
                          onClick={(e) => e.stopPropagation()}
                          title="More options"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* === RIGHT SIDEBAR === */}
      <div style={sidebarRight} className="history-sidebar">
        {/* Search */}
        <div style={searchBox}>
          <Search size={20} color="#aaa" />
          {searchActive ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                ref={searchInputRef}
                style={searchInput}
                type="text"
                placeholder="Search watch history"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderBottomColor =
                    "#3ea6ff";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderBottomColor =
                    "rgba(255,255,255,0.3)";
                }}
              />
              {searchQuery && (
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#aaa",
                    cursor: "pointer",
                    padding: "2px",
                  }}
                  onClick={() => {
                    setSearchQuery("");
                    setSearchActive(false);
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ) : (
            <button
              style={{
                ...sidebarItem,
                padding: "0",
                color: "#0f0f0f",
                fontSize: "14px",
              }}
              onClick={handleSearch}
            >
              Search watch history
            </button>
          )}
        </div>

        {/* Actions */}
        <button
          style={{
            ...sidebarItem,
            color: hoveredSidebar === "clear" ? "#0f0f0f" : "#0f0f0f",
            background:
              hoveredSidebar === "clear"
                ? "rgba(255,255,255,0.1)"
                : "transparent",
          }}
          onMouseEnter={() => setHoveredSidebar("clear")}
          onMouseLeave={() => setHoveredSidebar(null)}
          onClick={handleClearAll}
        >
          <Trash2 size={20} />
          <span>Clear all watch history</span>
        </button>

        <button
          style={{
            ...sidebarItem,
            background:
              hoveredSidebar === "pause"
                ? "rgba(255,255,255,0.1)"
                : "transparent",
          }}
          onMouseEnter={() => setHoveredSidebar("pause")}
          onMouseLeave={() => setHoveredSidebar(null)}
        >
          <Pause size={20} />
          <span>Pause watch history</span>
        </button>

        <button
          style={{
            ...sidebarItem,
            background:
              hoveredSidebar === "manage"
                ? "rgba(255,255,255,0.1)"
                : "transparent",
          }}
          onMouseEnter={() => setHoveredSidebar("manage")}
          onMouseLeave={() => setHoveredSidebar(null)}
        >
          <Settings size={20} />
          <span>Manage all history</span>
        </button>

        <div style={sidebarDivider} />

        {/* Tabs */}
        <button
          style={{
            ...sidebarTabItem,
            background:
              hoveredSidebar === "comments"
                ? "rgba(255,255,255,0.05)"
                : "transparent",
            color: hoveredSidebar === "comments" ? "#0f0f0f" : "#aaa",
          }}
          onMouseEnter={() => setHoveredSidebar("comments")}
          onMouseLeave={() => setHoveredSidebar(null)}
        >
          <MessageSquare size={18} />
          <span>Comments</span>
        </button>

        <button
          style={{
            ...sidebarTabItem,
            background:
              hoveredSidebar === "posts"
                ? "rgba(255,255,255,0.05)"
                : "transparent",
            color: hoveredSidebar === "posts" ? "#0f0f0f" : "#aaa",
          }}
          onMouseEnter={() => setHoveredSidebar("posts")}
          onMouseLeave={() => setHoveredSidebar(null)}
        >
          <FileText size={18} />
          <span>Posts</span>
        </button>

        <button
          style={{
            ...sidebarTabItem,
            background:
              hoveredSidebar === "live"
                ? "rgba(255,255,255,0.05)"
                : "transparent",
            color: hoveredSidebar === "live" ? "#0f0f0f" : "#aaa",
          }}
          onMouseEnter={() => setHoveredSidebar("live")}
          onMouseLeave={() => setHoveredSidebar(null)}
        >
          <Radio size={18} />
          <span>Live chat</span>
        </button>
      </div>

      {/* Responsive CSS via style tag */}
      <style>{`
        #history-page .history-sidebar {
          display: flex;
        }
        
        #history-page::-webkit-scrollbar {
          width: 0;
        }

        @media (max-width: 1100px) {
          #history-page {
            flex-direction: column !important;
          }
          #history-page .history-sidebar {
            width: 100% !important;
            min-width: 100% !important;
            padding: 0 24px 24px 24px !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 16px !important;
          }
          #history-page .history-sidebar > div:first-child {
            width: 100%;
            margin-bottom: 8px;
          }
          #history-page .history-sidebar > button {
            flex: none !important;
            width: auto !important;
          }
        }

        @media (max-width: 768px) {
          #history-page > div:first-child {
            padding: 16px 12px 24px 12px !important;
          }
        }

        @media (max-width: 600px) {
          #history-page > div:first-child {
            padding: 12px 8px 20px 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default History;
