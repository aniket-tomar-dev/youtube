import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { uploadToCloudinary } from "../utils/cloudinary";

const VIDEO_CATEGORIES = [
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

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setVideoProgress(0);
    setThumbnailProgress(0);
    setUploadStage("");

    if (!title.trim()) {
      setError("Video title is required.");
      return;
    }

    if (!videoFile) {
      setError("It is necessary to select a video file.");
      return;
    }

    try {
      setUploading(true);
      setUploadStage("Uploading video...");

      const videoUpload = await uploadToCloudinary(
        videoFile,
        "video",
        (progress) => {
          setVideoProgress(progress);
        },
      );
      let thumbnailUrl = null;

      if (thumbnailFile) {
        setUploadStage("Uploading thumbnail...");

        const thumbnailUpload = await uploadToCloudinary(
          thumbnailFile,
          "image",
          (progress) => {
            setThumbnailProgress(progress);
          },
        );

        thumbnailUrl = thumbnailUpload.url;
      }
      setUploadStage("Saving video information...");

      const res = await api.post("/videos", {
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUpload.url,
        thumbnailUrl,
        category: category || "All",
      });

      setUploadStage("Upload completed!");

      navigate(`/watch/${res.data.video.id}`);
    } catch (err: any) {
      console.error(err);

      setError(err.response?.data?.message || err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Upload Video</h2>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <label className="upload-field-label">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Select a category</option>
          {VIDEO_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label className="upload-field-label">
          Video file:
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          required
        />
        <label className="upload-field-label" style={{ marginTop: 14 }}>
          Thumbnail (optional):
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
        />
        {uploading && (
          <div style={{ marginTop: 20 }}>
            <p
              style={{
                fontSize: 14,
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              {uploadStage}
            </p>

            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  marginBottom: 5,
                }}
              >
                <span>Video</span>
                <span>{videoProgress}%</span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: 8,
                  background: "#e5e5e5",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${videoProgress}%`,
                    height: "100%",
                    background: "#ff0000",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
            </div>

            {thumbnailFile && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 5,
                  }}
                >
                  <span>Thumbnail</span>
                  <span>{thumbnailProgress}%</span>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: 8,
                    background: "#e5e5e5",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${thumbnailProgress}%`,
                      height: "100%",
                      background: "#ff0000",
                      transition: "width 0.2s ease",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        <button type="submit" disabled={uploading} style={{ marginTop: 14 }}>
          {uploading ? `${uploadStage}` : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;
