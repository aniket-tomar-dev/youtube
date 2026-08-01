import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import { Video, Channel } from "../types";
import { Users, PlaySquare } from "lucide-react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [videos, setVideos] = useState<Video[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);

    api
      .get(`/videos/search?q=${encodeURIComponent(query)}`)
      .then((res) => {
        setVideos(res.data.videos || []);
        setChannels(res.data.channels || []);
        setSearched(true);
      })
      .catch((err) => {
        console.error("Search failed:", err);
        setSearched(true);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const formatViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  if (!query.trim()) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          color: "#606060",
          gap: "16px",
          padding: "40px 24px",
        }}
      >
        <PlaySquare size={64} strokeWidth={1.2} />
        <p style={{ fontSize: "16px", color: "#606060" }}>
          Type something in the search bar to find videos and channels.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          fontSize: "16px",
          color: "#606060",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e5e5e5",
              borderTopColor: "#065fd4",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span>Searching for "{query}"...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const totalResults = videos.length + channels.length;

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "24px 24px 60px",
      }}
    >
      {/* Results Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#0f0f0f",
            margin: 0,
          }}
        >
          {searched && totalResults === 0
            ? `No results found for "${query}"`
            : `Search results for "${query}"`}
        </h2>
        {totalResults > 0 && (
          <span
            style={{
              fontSize: "13px",
              color: "#606060",
              background: "#f2f2f2",
              padding: "4px 12px",
              borderRadius: "12px",
              fontWeight: 500,
            }}
          >
            {totalResults} result{totalResults !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Channels section */}
      {channels.length > 0 && (
        <section style={{ marginBottom: "32px" }}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#0f0f0f",
              marginBottom: "16px",
            }}
          >
            <Users size={18} />
            Channels
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {channels.map((ch) => {
              const initial = ch.name.charAt(0).toUpperCase();
              return (
                <Link
                  key={ch.id}
                  to={`/channel/${ch.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    padding: "16px 20px",
                    background: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e5e5e5",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 4px 16px rgba(0,0,0,0.08)";
                    (e.currentTarget as HTMLElement).style.borderColor = "#c0c0c0";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.borderColor = "#e5e5e5";
                  }}
                >
                  <div
                    style={{
                      width: "68px",
                      height: "68px",
                      minWidth: "68px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #065fd4 0%, #1a73e8 100%)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(6,95,212,0.3)",
                    }}
                  >
                    {initial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#0f0f0f",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {ch.name}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#606060",
                        margin: "0 0 6px 0",
                      }}
                    >
                      {ch._count?.subscribers ?? 0} subscribers
                      {" · "}
                      {ch._count?.videos ?? 0} videos
                    </p>
                    {ch.description && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#606060",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ch.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Videos section */}
      {videos.length > 0 && (
        <section>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#0f0f0f",
              marginBottom: "16px",
            }}
          >
            <PlaySquare size={18} />
            Videos
          </h3>
          <div className="sv-list">
            {videos.map((v) => {
              const thumb = v.thumbnailUrl
                ? (v.thumbnailUrl.startsWith("http")
                    ? v.thumbnailUrl
                    : `http://localhost:5000/${v.thumbnailUrl.replace(/\\/g, "/")}`)
                : "https://placehold.co/360x202?text=No+Thumb";
              const init = v.channel?.name ? v.channel.name.charAt(0).toUpperCase() : "C";
              return (
                <Link key={v.id} to={`/watch/${v.id}`} className="sv-card">
                  <div className="sv-thumb">
                    <img src={thumb} alt={v.title} />
                  </div>
                  <div className="sv-info">
                    <h4 className="sv-title">{v.title}</h4>
                    <p className="sv-meta">
                      {formatViews(v.views ?? 0)} views · {formatDate(v.createdAt)}
                    </p>
                    <div className="sv-channel-row">
                      <span className="sv-avatar">{init}</span>
                      <span className="sv-channel-name">{v.channel?.name || "Channel"}</span>
                    </div>
                    {v.description && (
                      <p className="sv-desc">
                        {v.description.length > 120
                          ? v.description.slice(0, 120) + "..."
                          : v.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <style>{`
            .sv-list {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .sv-card {
              display: flex;
              gap: 16px;
              text-decoration: none;
              color: inherit;
              padding: 8px;
              border-radius: 12px;
              transition: background 0.15s ease;
            }
            .sv-card:hover {
              background: #f2f2f2;
            }
            .sv-thumb {
              width: 240px;
              min-width: 240px;
              height: 135px;
              border-radius: 10px;
              overflow: hidden;
              background: #e0e0e0;
              flex-shrink: 0;
            }
            .sv-thumb img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }
            .sv-info {
              flex: 1;
              min-width: 0;
              display: flex;
              flex-direction: column;
              gap: 6px;
              padding-top: 2px;
            }
            .sv-title {
              font-size: 16px;
              font-weight: 600;
              color: #0f0f0f;
              margin: 0;
              line-height: 1.4;
              word-break: break-word;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .sv-meta {
              font-size: 12px;
              color: #606060;
              margin: 0;
            }
            .sv-channel-row {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-top: 2px;
            }
            .sv-avatar {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #065fd4, #1a73e8);
              color: #fff;
              font-weight: 700;
              font-size: 11px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }
            .sv-channel-name {
              font-size: 13px;
              color: #606060;
            }
            .sv-desc {
              font-size: 12px;
              color: #606060;
              margin: 2px 0 0 0;
              line-height: 1.4;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            @media (max-width: 600px) {
              .sv-card {
                flex-direction: column;
              }
              .sv-thumb {
                width: 100%;
                min-width: unset;
                height: auto;
                aspect-ratio: 16/9;
              }
            }
          `}</style>
        </section>
      )}

      {/* No results state */}
      {searched && totalResults === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
            color: "#606060",
            gap: "16px",
          }}
        >
          <PlaySquare size={80} strokeWidth={1} />
          <p style={{ fontSize: "16px", margin: 0 }}>
            No videos or channels found for <strong>"{query}"</strong>
          </p>
          <span style={{ fontSize: "14px", color: "#909090" }}>
            Try different keywords or check your spelling.
          </span>
        </div>
      )}

    </div>
  );
};

export default SearchPage;
