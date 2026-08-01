import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Channel } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/ui/dialog";
import {
  Menu,
  House,
  Clapperboard,
  MonitorPlay,
  RotateCcwClock,
  ListMusic,
  Clock8,
  Mic,
  Search,
  Bell,
  ThumbsUp,
  TrendingUp,
  Music,
  TvMinimalPlay,
  Gamepad2,
} from "lucide-react";

import { FaYoutube } from "react-icons/fa";

interface NavbarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ sidebarOpen = true, setSidebarOpen }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [subscribedChannels, setSubscribedChannels] = useState<Channel[]>([]);

  useEffect(() => {
    if (user) {
      api
        .get("/subscriptions/me")
        .then((res) => setSubscribedChannels(res.data.subscriptions || []))
        .catch(() => setSubscribedChannels([]));
    } else {
      setSubscribedChannels([]);
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e: any) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  const toggleSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen((prev) => !prev);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <button
            className="menu-btn"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="youtube-logo">
            <span className="youtube-icon">
              <FaYoutube />
            </span>
            <span className="youtube-text">YouTube </span>
            <span>
              <sup style={{ fontSize: "12px" }}>IN</sup>
            </span>
          </Link>
        </div>

        <form className="search-container" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="search-btn" title="Search">
              <Search size={18} />
            </button>
          </div>

          <button
            type="button"
            className="mic-btn"
            title="Search with your voice"
          >
            <Mic size={18} />
          </button>
        </form>

        <div className="navbar-right">
          {user ? (
            <>
              {user.channel ? (
                <>
                  <Link to="/upload" className="create-btn">
                    <span>＋</span>
                    <span>Create</span>
                  </Link>

                  <Link
                    to={`/channel/${user.channel.id}`}
                    className="channel-name"
                  >
                    {user.channel.name}
                  </Link>
                </>
              ) : (
                <Link to="/create-channel" className="create-btn">
                  Create Channel
                </Link>
              )}

              <button className="icon-btn" title="Notifications">
                <Bell size={20} />
              </button>
              {/* <div className="profile-container">
                <button
                  className="profile-btn"
                  onClick={handleLogout}
                  title="Logout"
                >
                  {user.channel?.name?.charAt(0)?.toUpperCase() ||
                    user.name?.charAt(0)?.toUpperCase() ||
                    "U"}
                </button>
              </div> */}
              <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="login-btn">
                Sign in
              </Link>
              <Link to="/register" className="signup-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <div className="sidebar-section">
          <Link to="/" className="sidebar-item active">
            <span className="sidebar-icon">
              <House size={20} />
            </span>
            <span className="sidebar-label">Home</span>
          </Link>

          <Link to="/shorts" className="sidebar-item">
            <span className="sidebar-icon">
              <Clapperboard size={20} />
            </span>
            <span className="sidebar-label">Shorts</span>
          </Link>
        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">
            <span>You</span>
            <span>›</span>
          </h3>

          <Link to="/history" className="sidebar-item">
            <span className="sidebar-icon">
              <RotateCcwClock size={20} />
            </span>
            <span className="sidebar-label">History</span>
          </Link>

          <Link to="/playlists" className="sidebar-item">
            <span className="sidebar-icon">
              <ListMusic size={20} />
            </span>
            <span className="sidebar-label">Playlists</span>
          </Link>

          <Link to="/watch-later" className="sidebar-item">
            <span className="sidebar-icon">
              <Clock8 size={20} />
            </span>
            <span className="sidebar-label">Watch later</span>
          </Link>

          <Link to="/liked-videos" className="sidebar-item">
            <span className="sidebar-icon">
              <ThumbsUp size={20} />
            </span>
            <span className="sidebar-label">Liked videos</span>
          </Link>
        </div>

        {user && subscribedChannels.length > 0 && (
          <>
            <div className="sidebar-divider"></div>

            <div className="sidebar-section">
              <Link to="/subscriptions">
                <h3 className="sidebar-heading sidebar-subscriptions-heading">
                  Subscriptions
                </h3>
              </Link>

              {subscribedChannels.map((channel) => {
                const initial = channel.name
                  ? channel.name.charAt(0).toUpperCase()
                  : "C";
                return (
                  <Link
                    key={channel.id}
                    to={`/channel/${channel.id}`}
                    className="sidebar-item sidebar-channel-item"
                  >
                    <span className="sidebar-icon">
                      <span className="sidebar-channel-avatar">{initial}</span>
                    </span>
                    <span className="sidebar-label sidebar-channel-name">
                      {channel.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <div className="sidebar-divider"></div>

        <div className="sidebar-section">
          <h3 className="sidebar-heading">Explore</h3>

          <Link to="/trending" className="sidebar-item">
            <span className="sidebar-icon">
              <TrendingUp size={20} />
            </span>
            <span className="sidebar-label">Trending</span>
          </Link>

          <Link to="/music" className="sidebar-item">
            <span className="sidebar-icon">
              <Music size={20} />
            </span>
            <span className="sidebar-label">Music</span>
          </Link>

          <Link to="/movies" className="sidebar-item">
            <span className="sidebar-icon">
              <TvMinimalPlay size={20} />
            </span>
            <span className="sidebar-label">Movies</span>
          </Link>

          <Link to="/gaming" className="sidebar-item">
            <span className="sidebar-icon">
              <Gamepad2 size={20} />
            </span>
            <span className="sidebar-label">Gaming</span>
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
