import React, { useState } from "react";
import { ChevronDown, MoreVertical, ListVideo, Play } from "lucide-react";

// Dummy data closely mimicking the user's screenshot
const dummyPlaylists = [
  {
    id: "1",
    title: "Liked videos",
    videoCount: 10,
    visibility: "Private",
    thumbnail:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    hasNoVideos: false,
  },
  {
    id: "2",
    title: "Watch later",
    videoCount: 0,
    visibility: "Private",
    thumbnail: "",
    hasNoVideos: true,
  },
];

const Playlists = () => {
  const [activeTab, setActiveTab] = useState("Playlists");

  return (
    <div className="min-h-screen text-[#0f0f0f] bg-transparent py-6 px-4 md:px-8 w-full">
      <div style={{ marginLeft: "20px" }} className="max-w-7xl  mx-auto w-full">
        <h1
          style={{ marginBottom: "25px", marginTop: "35px" }}
          className="text-3xl sm:text-4xl font-bold mb-3"
        >
          Playlists
        </h1>

        <div
          style={{ marginBottom: "30px" }}
          className="flex flex-wrap items-center gap-3 mb-6 "
        >
          <button className="flex items-center gap-2 w-35 h-8 bg-gray-200 hover:bg-gray-200 text-black text-sm font-medium  rounded-lg transition-colors cursor-pointer ">
            Recently added
            <ChevronDown size={18} className="text-black" />
          </button>

          <button
            onClick={() => setActiveTab("Playlists")}
            className={`px-4 py-2 rounded-lg text-sm w-25 h-8 font-medium transition-colors cursor-pointer ${
              activeTab === "Playlists"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200 text-black"
            }`}
          >
            Playlists
          </button>

          <button
            onClick={() => setActiveTab("Owned")}
            className={`px-4 py-2 rounded-lg text-sm w-25 h-8 font-medium transition-colors cursor-pointer ${
              activeTab === "Owned"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200 text-black"
            }`}
          >
            Owned
          </button>
        </div>

        <div
          style={{ marginTop: "20px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-4 mt-10"
        >
          {dummyPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex flex-col group cursor-pointer"
            >
              <div className="relative mt-4">
                <div className="absolute -top-3 left-3 right-3 h-4 bg-gray-200 rounded-t-xl z-0 "></div>

                <div className="absolute -top-1.5 left-1.5 right-1.5 h-3 bg-gray-300 rounded-t-xl z-10"></div>

                <div className="relative z-20 w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                  {playlist.hasNoVideos ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="w-16 h-10 bg-gray-300/80 rounded-xl flex items-center justify-center gap-1.5 px-3 border border-gray-300">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute  bg-black/60  flex items-center justify-center z-30">
                    <div className="flex items-center gap-2">
                      <Play size={24} fill="white" className="text-white" />
                      <span className="text-white font-medium uppercase text-xs ">
                        Play all
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded flex items-center gap-1 z-40 text-xs font-semibold text-white/95 ">
                    <ListVideo size={14} className="stroke-[2.5px]" />
                    <span>
                      {playlist.hasNoVideos
                        ? "No videos"
                        : `${playlist.videoCount} videos`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between mt-3 pr-1">
                <div className="flex flex-col">
                  <h3 className="text-[#0f0f0f] font-semibold text-base ">
                    {playlist.title}
                  </h3>
                  <div className="text-[#606060] text-[13px] font-medium mt-1 flex items-center gap-1">
                    <span>{playlist.visibility}</span>
                    <span className="text-[10px]">&bull;</span>
                    <span>Playlist</span>
                  </div>
                  <button className="text-[#606060] text-[13px] font-semibold mt-1 hover:text-[#0f0f0f] transition-colors duration-200 self-start">
                    View full playlist
                  </button>
                </div>

                <button className="text-[#0f0f0f] opacity-100 p-1 hover:bg-gray-100 rounded-full transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlists;
