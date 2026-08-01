import { useEffect, useState } from "react";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";
import { Video } from "../types";

const PREDEFINED_CATEGORIES = [
  "All",
  "Music",
  "Gaming",
  "Education",
  "Entertainment",
  "Sports",
  "News",
  "Comedy",
  "Science & Technology",
  "Film & Animation",
  "Howto & Style",
  "Travel & Events",
];

const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<string[]>(PREDEFINED_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await api.get("/videos", {
          params: activeCategory !== "All" ? { category: activeCategory } : {},
        });
        setVideos(res.data.videos);

        if (res.data.categories) {
          const merged = [...PREDEFINED_CATEGORIES];
          res.data.categories.forEach((cat: string) => {
            if (!merged.includes(cat)) merged.push(cat);
          });
          setCategories(merged);
        }
      } catch (err) {
        console.error("Videos could not be fetched:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [activeCategory]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="home-page">
      <div className="category-bar">
        <div className="category-chips-wrapper">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="loading-state">Loading videos...</div>
      ) : videos.length === 0 ? (
        <div className="empty-state">
          {activeCategory !== "All"
            ? `No videos found in "${activeCategory}" category. Try another category! 🎯`
            : "No video has been uploaded yet. You should be the first one to do it! 🎬"}
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
