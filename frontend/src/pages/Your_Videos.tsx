import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import { Video } from "../types";

const Your_Videos = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setLoading(false);
            return;
        }

        if (!user.channel?.id) {
            setLoading(false);
            return;
        }

        const fetchMyVideos = async () => {
            try {
                const res = await api.get(`/channels/${user.channel?.id}`);
                if (res.data.channel && res.data.channel.videos) {
                    setVideos(res.data.channel.videos);
                }
            } catch (err) {
                console.error("Failed to fetch your videos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyVideos();
    }, [user, authLoading]);

    if (authLoading || (loading && user?.channel?.id)) {
        return <div className="loading-state">Loading your videos...</div>;
    }

    if (!user) {
        return (
            <div className="empty-state" style={{ height: "calc(100vh - 80px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <h2>Sign in to see your videos</h2>
                <button
                    onClick={() => navigate("/login")}
                    style={{
                        marginTop: "16px",
                        padding: "10px 24px",
                        background: "var(--yt-blue-btn, #3ea6ff)",
                        color: "var(--yt-bg, #0f0f0f)",
                        border: "none",
                        borderRadius: "20px",
                        fontWeight: 500,
                        cursor: "pointer"
                    }}
                >
                    Sign In
                </button>
            </div>
        );
    }

    if (!user.channel) {
        return (
            <div className="empty-state" style={{ height: "calc(100vh - 80px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <h2>You don't have a channel yet.</h2>
                <button
                    onClick={() => navigate("/create-channel")}
                    style={{
                        marginTop: "16px",
                        padding: "10px 24px",
                        background: "var(--yt-blue-btn, #3ea6ff)",
                        color: "var(--yt-bg, #0f0f0f)",
                        border: "none",
                        borderRadius: "20px",
                        fontWeight: 500,
                        cursor: "pointer"
                    }}
                >
                    Create Channel
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px", minHeight: "calc(100vh - 80px)", background: "var(--yt-bg)", color: "var(--yt-text-primary)" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>Your Videos</h1>

            {videos.length === 0 ? (
                <div className="empty-state" style={{ marginTop: "40px", textAlign: "center", color: "var(--yt-text-secondary)" }}>
                    You haven't uploaded any videos yet.
                </div>
            ) : (
                <div className="video-grid">
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={{ ...video, channel: { id: user.channel!.id, name: user.channel!.name } }} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Your_Videos;