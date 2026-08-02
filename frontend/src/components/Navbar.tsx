import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/ui/dropdown-menu";
import {
  Menu,
  Mic,
  Search,
  Bell,
  UserRound,
  LogOut,
  CreditCard,
  Database,
  Moon,
  Languages,
  ShieldCheck,
  Globe,
  Keyboard,
  Settings,
  CircleHelp,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

import { FaYoutube } from "react-icons/fa";
import { Button } from "@base-ui/react";

interface NavbarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ setSidebarOpen }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

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
    <header className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center justify-between px-4 z-1000 border-b border-[#e5e5e5]">
      {/* Left Section */}
      <div className="flex items-center gap-4 min-w-42.5">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full text-[#0f0f0f] transition-colors duration-150 hover:bg-[#f2f2f2]"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <Link
          to="/"
          className="flex items-center gap-1 font-bold text-[19px] tracking-[-0.5px] text-[#0f0f0f] no-underline"
        >
          <span className="text-[#ff0000] text-[30px] leading-none">
            <FaYoutube />
          </span>
          <span className="font-bold font-[Roboto,sans-serif] tracking-[-1px]">
            YouTube{" "}
          </span>
          <span>
            <sup style={{ fontSize: "12px" }}>IN</sup>
          </span>
        </Link>
      </div>

      {/* Search Section */}
      <form
        className="flex items-center justify-center gap-3 flex-[0_1_730px] mx-4"
        onSubmit={handleSearch}
      >
        <div className="flex items-center w-full max-w-150 h-10">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-full px-4 text-[15px] border border-[#ccc] border-r-0 rounded-l-[40px] outline-none bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] focus:border-[#065fd4] pl-5"
          />
          <button
            type="submit"
            className="w-16 h-full bg-[#e0dddd] border border-[#141414] rounded-r-[40px] flex items-center justify-center text-[#0f0f0f] transition-colors duration-150 hover:bg-[#f0f0f0]"
            title="Search"
          >
            <Search size={18} />
          </button>
        </div>

        <button
          type="button"
          className="w-10 h-10 min-w-10 rounded-full bg-[#f2f2f2] flex items-center justify-center text-[#0f0f0f] transition-colors duration-150 hover:bg-[#e5e5e5] max-[768px]:hidden"
          title="Search with your voice"
        >
          <Mic size={18} />
        </button>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-3 min-w-45 justify-end max-[480px]:min-w-auto max-[480px]:gap-2">
        {user ? (
          <>
            {user.channel ? (
              <>
                <Button className="items-center w-20">
                  <Link
                    to="/upload"
                    className="flex items-center gap-1.5 px-3.5 h-9 rounded-[18px] bg-[#f2f2f2] text-[#0f0f0f] text-sm font-medium transition-colors duration-150 hover:bg-[#e5e5e5] no-underline w-20"
                  >
                    <span>＋</span>
                    <span>Create</span>
                  </Link>
                </Button>

                <Link
                  to={`/channel/${user.channel.id}`}
                  className="text-sm font-medium text-[#0f0f0f] max-w-30 whitespace-nowrap overflow-hidden text-ellipsis no-underline"
                >
                  {user.channel.name}
                </Link>
              </>
            ) : (
              <Link
                to="/create-channel"
                className="flex items-center gap-1.5 px-3.5 h-9 rounded-[18px] bg-[#f2f2f2] text-[#0f0f0f] text-sm font-medium transition-colors duration-150 hover:bg-[#e5e5e5] no-underline"
              >
                Create Channel
              </Link>
            )}

            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#0f0f0f] transition-colors duration-150 hover:bg-[#f2f2f2]"
              title="Notifications"
            >
              <Bell size={20} />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="w-9 h-9 rounded-full bg-[#065fd4] text-white font-semibold text-[15px] flex items-center justify-center hover:opacity-90 transition-opacity outline-none focus:outline-none ">
                {user.channel?.name?.charAt(0)?.toUpperCase() ||
                  user.name?.charAt(0)?.toUpperCase() ||
                  "U"}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="w-75 max-w-[calc(100vw-16px)] max-h-[calc(100vh-72px)] overflow-y-auto overflow-x-hidden rounded-2xl border border-[#d9d9d9] bg-white p-2 text-[#0f0f0f] shadow-[0_4px_24px_rgba(0,0,0,0.18)] "
              >
                <div
                  style={{ marginLeft: "10px", marginTop: "10px" }}
                  className=" px-3 py-2 "
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#3f444b] text-white flex items-center justify-center font-semibold text-[16px ">
                      {user.channel?.name?.charAt(0)?.toUpperCase() ||
                        user.name?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </div>
                    <div className="min-w-0 flex-1 ">
                      <p className="text-[15px] font-medium text-[#0f0f0f] truncate">
                        {user.channel?.name || user.name}
                      </p>

                      <p className="mt-0.5 text-[12px] text-[#606060] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    style={{ marginLeft: "10px", marginTop: "10px" }}
                    className="  mt-1.5  px-0  py-1  text-[14px]  font-medium  text-[#065fd4]  hover:underline  outline-non  "
                  >
                    Manage your account
                  </button>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    style={{ marginLeft: "10px" }}
                    className="items-center gap-4 h-10 flex rounded-lg px-3 text-[14px] font-normal cursor-pointer hover:bg-[#f2f2f2] focus:bg-[#f2f2f2]"
                  >
                    <UserRound
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#0f0f0f]"
                    />

                    <span className="flex-1 truncate">Switch account</span>

                    <ChevronRight
                      size={17}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#606060]"
                    />
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    style={{ marginLeft: "10px" }}
                    className="  flex  items-center  gap-4  h-10  rounded-lg  px-3  text-[14px]  font-normal  cursor-pointer  hover:bg-[#f2f2f2]  focus:bg-[#f2f2f2  "
                  >
                    <LogOut
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#0f0f0f]"
                    />

                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    style={{ marginLeft: "10px" }}
                    className="  flex  items-center  gap-4  h-10  rounded-lg  px-3  text-[14px]  font-normal  cursor-pointer  hover:bg-[#f2f2f2]  focus:bg-[#f2f2f2  "
                  >
                    <span>YouTube Studio</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    style={{ marginLeft: "10px" }}
                    className=" flex items-center gap-4 h-10 rounded-lg px-3 text-[14px] font-normal cursor-pointer hover:bg-[#f2f2f2] focus:bg-[#f2f2f2] "
                  >
                    <CreditCard
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#0f0f0f]"
                    />

                    <span className="truncate">Purchases and memberships</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <div style={{ marginLeft: "10px" }} className="px-3 py-1.5">
                  <p className="text-[12px] font-medium text-[#606060]">
                    Your data in YouTube
                  </p>
                </div>

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    style={{ marginLeft: "10px" }}
                    className="  flex  items-center  gap-4  h-10  rounded-lg  px-3  text-[14px]  font-normal  cursor-pointer  hover:bg-[#f2f2f2]  focus:bg-[#f2f2f2  "
                  >
                    <Moon
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#0f0f0f]"
                    />

                    <span className="flex-1 truncate">
                      Appearance: Device theme
                    </span>

                    <ChevronRight
                      size={17}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#606060]"
                    />
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    style={{ marginLeft: "10px" }}
                    className="  flex  items-center  gap-4  h-10  rounded-lg  px-3  text-[14px]  font-normal  cursor-pointer  hover:bg-[#f2f2f2]  focus:bg-[#f2f2f2  "
                  >
                    <Languages
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#0f0f0f]"
                    />

                    <span className="flex-1 truncate">
                      Display language: English
                    </span>

                    <ChevronRight
                      size={17}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#606060]"
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    style={{ marginLeft: "10px" }}
                    className="  flex  items-center  gap-4  h-10  rounded-lg  px-3  text-[14px]  font-normal  cursor-pointer  hover:bg-[#f2f2f2]  focus:bg-[#f2f2f2  "
                  >
                    <ShieldCheck
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#0f0f0f]"
                    />

                    <span className="flex-1 truncate">
                      Restricted Mode: Off
                    </span>

                    <ChevronRight
                      size={17}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#606060]"
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    style={{ marginLeft: "10px" }}
                    className=" flex items-center gap-4 h-10 rounded-lg px-3 text-[14px] font-normal cursor-pointer hover:bg-[#f2f2f2] focus:bg-[#f2f2f2]"
                  >
                    <Globe
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#0f0f0f]"
                    />

                    <span className="flex-1 truncate">Location: India</span>

                    <ChevronRight
                      size={17}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#606060]"
                    />
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    style={{ marginLeft: "10px" }}
                    className=" flex items-center gap-4 h-10 rounded-lg px-3 text-[14px] font-normal cursor-pointer hover:bg-[#f2f2f2] focus:bg-[#f2f2f2] "
                  >
                    <Keyboard
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#0f0f0f]"
                    />

                    <span>Keyboard shortcuts</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  style={{ marginLeft: "10px" }}
                  className=" flex items-center gap-4 h-10 rounded-lg px-3 text-[14px] font-normal cursor-pointer hover:bg-[#f2f2f2] focus:bg-[#f2f2f2 "
                >
                  <Settings
                    size={18}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#0f0f0f]"
                  />

                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    style={{ marginLeft: "10px" }}
                    className="  flex  items-center  gap-4  h-10  rounded-lg  px-3  text-[14px]  font-normal  cursor-pointer  hover:bg-[#f2f2f2]  focus:bg-[#f2f2f2  "
                  >
                    <CircleHelp
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#0f0f0f]"
                    />

                    <span>Help</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    style={{ marginLeft: "10px" }}
                    className="  flex  items-center  gap-4  h-10  rounded-lg  px-3  text-[14px]  font-normal  cursor-pointer  hover:bg-[#f2f2f2]  focus:bg-[#f2f2f2  "
                  >
                    <MessageSquare
                      size={18}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#0f0f0f]"
                    />

                    <span>Send feedback</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex items-center px-3.75 h-9 border border-[#def] rounded-[18px] text-[#065fd4] text-sm font-medium transition-colors duration-150 hover:bg-[#def] no-underline"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-3.75 h-9 rounded-[18px] bg-[#065fd4] text-white text-sm font-medium transition-opacity duration-150 hover:opacity-90 no-underline"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
