import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Channel } from "../types";
import {
  House,
  Clapperboard,
  RotateCcwClock,
  ListMusic,
  Clock8,
  ThumbsUp,
  TrendingUp,
  Music,
  TvMinimalPlay,
  Gamepad2,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ sidebarOpen = true, setSidebarOpen }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();

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

  return (
    <>
      <aside
        className={`sidebar fixed top-14 left-0 bottom-0 bg-white overflow-y-auto z-900 border-r border-[#e5e5e5] transition-[width] duration-200 ease-out ${
          sidebarOpen
            ? "sidebar-open w-60 p-3"
            : "sidebar-closed w-18 py-2 px-1"
        }`}
      >
        {/* Main nav section */}
        <div className="flex flex-col gap-2">
          <Link
            to="/"
            className={`flex items-center rounded-[10px] text-[#0f0f0f] text-sm no-underline transition-colors duration-150 hover:bg-[#f2f2f2] ${
              location.pathname === "/" ? "bg-[#f2f2f2] font-semibold" : ""
            } ${
              sidebarOpen
                ? "h-10 px-3 gap-6 flex-row"
                : "flex-col justify-center items-center py-3 gap-1.5 rounded-[10px] h-15"
            }`}
          >
            <span className="flex items-center justify-center">
              <House size={20} />
            </span>
            <span
              className={`whitespace-nowrap overflow-hidden text-ellipsis ${
                !sidebarOpen ? "text-[10px] font-normal text-center" : ""
              }`}
            >
              Home
            </span>
          </Link>

          <Link
            to="/shorts"
            className={`flex items-center rounded-[10px] text-[#0f0f0f] text-sm no-underline transition-colors duration-150 hover:bg-[#f2f2f2] ${
              location.pathname === "/shorts"
                ? "bg-[#f2f2f2] font-semibold"
                : ""
            } ${
              sidebarOpen
                ? "h-10 px-3 gap-6 flex-row"
                : "flex-col justify-center items-center py-3 gap-1.5 rounded-[10px] h-15"
            }`}
          >
            <span className="flex items-center justify-center">
              <Clapperboard size={20} />
            </span>
            <span
              className={`whitespace-nowrap overflow-hidden text-ellipsis ${
                !sidebarOpen ? "text-[10px] font-normal text-center" : ""
              }`}
            >
              Shorts
            </span>
          </Link>
        </div>

        {/* Divider */}
        {sidebarOpen && <div className="h-px bg-[#e5e5e5] my-3"></div>}

        {/* You section */}
        <div className="flex flex-col gap-0.5">
          {sidebarOpen && (
            <h3 className="text-[15px] font-semibold py-1.5 px-3 flex items-center gap-1 text-[#0f0f0f]">
              <span>You</span>
              <span>›</span>
            </h3>
          )}

          <Link
            to="/history"
            className={`flex items-center rounded-[10px] text-[#0f0f0f] text-sm no-underline transition-colors duration-150 hover:bg-[#f2f2f2] ${
              location.pathname === "/history"
                ? "bg-[#f2f2f2] font-semibold"
                : ""
            } ${
              sidebarOpen
                ? "h-10 px-3 gap-6 flex-row"
                : "flex-col justify-center items-center py-3 gap-1.5 rounded-[10px] h-15"
            }`}
          >
            <span className="flex items-center justify-center">
              <RotateCcwClock size={20} />
            </span>
            <span
              className={`whitespace-nowrap overflow-hidden text-ellipsis ${
                !sidebarOpen ? "text-[10px] font-normal text-center" : ""
              }`}
            >
              History
            </span>
          </Link>

          <Link
            to="/playlists"
            className={`flex items-center rounded-[10px] text-[#0f0f0f] text-sm no-underline transition-colors duration-150 hover:bg-[#f2f2f2] ${
              location.pathname === "/playlists"
                ? "bg-[#f2f2f2] font-semibold"
                : ""
            } ${
              sidebarOpen
                ? "h-10 px-3 gap-6 flex-row"
                : "flex-col justify-center items-center py-3 gap-1.5 rounded-[10px] h-15"
            }`}
          >
            <span className="flex items-center justify-center">
              <ListMusic size={20} />
            </span>
            <span
              className={`whitespace-nowrap overflow-hidden text-ellipsis ${
                !sidebarOpen ? "text-[10px] font-normal text-center" : ""
              }`}
            >
              Playlists
            </span>
          </Link>

          <Link
            to="/watch-later"
            className={`flex items-center rounded-[10px] text-[#0f0f0f] text-sm no-underline transition-colors duration-150 hover:bg-[#f2f2f2] ${
              location.pathname === "/watch-later"
                ? "bg-[#f2f2f2] font-semibold"
                : ""
            } ${
              sidebarOpen
                ? "h-10 px-3 gap-6 flex-row"
                : "flex-col justify-center items-center py-3 gap-1.5 rounded-[10px] h-15"
            }`}
          >
            <span className="flex items-center justify-center">
              <Clock8 size={20} />
            </span>
            <span
              className={`whitespace-nowrap overflow-hidden text-ellipsis ${
                !sidebarOpen ? "text-[10px] font-normal text-center" : ""
              }`}
            >
              Watch later
            </span>
          </Link>

          <Link
            to="/liked-videos"
            className={`flex items-center rounded-[10px] text-[#0f0f0f] text-sm no-underline transition-colors duration-150 hover:bg-[#f2f2f2] ${
              location.pathname === "/liked-videos"
                ? "bg-[#f2f2f2] font-semibold"
                : ""
            } ${
              sidebarOpen
                ? "h-10 px-3 gap-6 flex-row"
                : "flex-col justify-center items-center py-3 gap-1.5 rounded-[10px] h-15"
            }`}
          >
            <span className="flex items-center justify-center">
              <ThumbsUp size={20} />
            </span>
            <span
              className={`whitespace-nowrap overflow-hidden text-ellipsis ${
                !sidebarOpen ? "text-[10px] font-normal text-center" : ""
              }`}
            >
              Liked videos
            </span>
          </Link>
        </div>

        {/* Subscriptions section */}
        {user && subscribedChannels.length > 0 && (
          <>
            {sidebarOpen && <div className="h-px bg-[#e5e5e5] my-3"></div>}

            <div className="flex flex-col gap-0.5">
              {sidebarOpen && (
                <Link to="/subscriptions">
                  <h3 className="text-[15px] font-semibold py-1.5 px-3 text-[#0f0f0f]">
                    Subscriptions
                  </h3>
                </Link>
              )}

              {subscribedChannels.map((channel) => {
                const initial = channel.name
                  ? channel.name.charAt(0).toUpperCase()
                  : "C";
                return (
                  <Link
                    key={channel.id}
                    to={`/channel/${channel.id}`}
                    className={`flex items-center rounded-[10px] text-[#0f0f0f] text-sm no-underline transition-colors duration-150 hover:bg-[#f2f2f2] ${
                      sidebarOpen
                        ? "h-10 px-3 gap-4 flex-row"
                        : "flex-col justify-center items-center py-2.5 gap-1 rounded-[10px] h-15"
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <span className="w-7 h-7 min-w-7 rounded-full bg-linear-to-br from-[#065fd4] to-[#1a73e8] text-white font-bold text-[13px] flex items-center justify-center shrink-0 shadow-[0_1px_4px_rgba(6,95,212,0.25)]">
                        {initial}
                      </span>
                    </span>
                    {sidebarOpen && (
                      <span className="text-sm font-normal text-[#0f0f0f] whitespace-nowrap overflow-hidden text-ellipsis">
                        {channel.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Divider */}
        {sidebarOpen && <div className="h-px bg-[#e5e5e5] my-3"></div>}

        {/* Explore section */}
        <div className="flex flex-col gap-0.5">
          {sidebarOpen && (
            <h3 className="text-[15px] font-semibold py-1.5 px-3 flex items-center gap-1 text-[#0f0f0f]">
              Explore
            </h3>
          )}

          <Link
            to="/trending"
            className={`flex items-center rounded-[10px] text-[#0f0f0f] text-sm no-underline transition-colors duration-150 hover:bg-[#f2f2f2] ${
              location.pathname === "/trending"
                ? "bg-[#f2f2f2] font-semibold"
                : ""
            } ${
              sidebarOpen
                ? "h-10 px-3 gap-6 flex-row"
                : "flex-col justify-center items-center py-3 gap-1.5 rounded-[10px] h-15"
            }`}
          >
            <span className="flex items-center justify-center">
              <TrendingUp size={20} />
            </span>
            <span
              className={`whitespace-nowrap overflow-hidden text-ellipsis ${
                !sidebarOpen ? "text-[10px] font-normal text-center" : ""
              }`}
            >
              Trending
            </span>
          </Link>

          <Link
            to="/music"
            className={`flex items-center rounded-[10px] text-[#0f0f0f] text-sm no-underline transition-colors duration-150 hover:bg-[#f2f2f2] ${
              location.pathname === "/music" ? "bg-[#f2f2f2] font-semibold" : ""
            } ${
              sidebarOpen
                ? "h-10 px-3 gap-6 flex-row"
                : "flex-col justify-center items-center py-3 gap-1.5 rounded-[10px] h-15"
            }`}
          >
            <span className="flex items-center justify-center">
              <Music size={20} />
            </span>
            <span
              className={`whitespace-nowrap overflow-hidden text-ellipsis ${
                !sidebarOpen ? "text-[10px] font-normal text-center" : ""
              }`}
            >
              Music
            </span>
          </Link>

          <Link
            to="/movies"
            className={`flex items-center rounded-[10px] text-[#0f0f0f] text-sm no-underline transition-colors duration-150 hover:bg-[#f2f2f2] ${
              location.pathname === "/movies"
                ? "bg-[#f2f2f2] font-semibold"
                : ""
            } ${
              sidebarOpen
                ? "h-10 px-3 gap-6 flex-row"
                : "flex-col justify-center items-center py-3 gap-1.5 rounded-[10px] h-15"
            }`}
          >
            <span className="flex items-center justify-center">
              <TvMinimalPlay size={20} />
            </span>
            <span
              className={`whitespace-nowrap overflow-hidden text-ellipsis ${
                !sidebarOpen ? "text-[10px] font-normal text-center" : ""
              }`}
            >
              Movies
            </span>
          </Link>

          <Link
            to="/gaming"
            className={`flex items-center rounded-[10px] text-[#0f0f0f] text-sm no-underline transition-colors duration-150 hover:bg-[#f2f2f2] ${
              location.pathname === "/gaming"
                ? "bg-[#f2f2f2] font-semibold"
                : ""
            } ${
              sidebarOpen
                ? "h-10 px-3 gap-6 flex-row"
                : "flex-col justify-center items-center py-3 gap-1.5 rounded-[10px] h-15"
            }`}
          >
            <span className="flex items-center justify-center">
              <Gamepad2 size={20} />
            </span>
            <span
              className={`whitespace-nowrap overflow-hidden text-ellipsis ${
                !sidebarOpen ? "text-[10px] font-normal text-center" : ""
              }`}
            >
              Gaming
            </span>
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay max-[768px]:block fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-940 hidden"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
