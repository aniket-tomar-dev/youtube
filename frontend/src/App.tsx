import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateChannel from "./pages/CreateChannel";
import UploadVideo from "./pages/UploadVideo";
import WatchVideo from "./pages/WatchVideo";
import ChannelPage from "./pages/Channel";
import SearchPage from "./pages/Search";
import History from "./pages/History";
import Playlists from "./pages/Playlists";
import WatchLater from "./pages/WatchLater";
import LikedVideos from "./pages/LikedVideos";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`app-container ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}
      >
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/watch/:id" element={<WatchVideo />} />
            <Route path="/channel/:id" element={<ChannelPage />} />
            <Route path="/search" element={<SearchPage />} />

            <Route
              path="/create-channel"
              element={
                <ProtectedRoute>
                  <CreateChannel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadVideo />
                </ProtectedRoute>
              }
            />
            <Route path="/history" element={<History />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/watch-later" element={<WatchLater />} />
            <Route path="/liked-videos" element={<LikedVideos />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
