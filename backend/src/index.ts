import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

dotenv.config();

import authRoutes from "./routes/auth.routes";
import channelRoutes from "./routes/channel.routes";
import likeRoutes from "./routes/like.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import videoRoutes from "./routes/video.routes";
import historyRoutes from "./routes/history.routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "YouTube Clone API is running " });
});
app.listen(PORT, () => {
  console.log(`Server is runing: http://localhost:${PORT}`);
});
