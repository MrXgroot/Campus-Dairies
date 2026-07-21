import React from "react";
import { Home, Users, MessageSquare, Bell, User, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useSocketMessageStore from "../../store/socketMessageStore";

const DesktopSidebar = ({ onCreatePostClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { newNotification } = useSocketMessageStore();

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: Home,
    },
    {
      label: "Groups",
      path: "/groups",
      icon: Users,
    },
    {
      label: "Message Wall",
      path: "/messagewall",
      icon: MessageSquare,
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: Bell,
      badge: newNotification,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <aside className="w-64 h-full bg-[#0b0b0b] border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="px-6 py-6 border-b border-gray-800 cursor-pointer"
      >
        <h1 className="text-2xl font-bold text-white">
          Campus<span className="text-blue-500">Diary</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-2">
        {navItems.map(({ label, path, icon: Icon, badge }) => {
          const active = location.pathname === path;

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-500" />
              )}

              <Icon size={20} />

              <span>{label}</span>

              {badge && (
                <span className="ml-auto h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Create Post */}
      <div className="px-4 pb-5">
        <button
          onClick={() =>
            onCreatePostClick ? onCreatePostClick() : navigate("/messagewall")
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Post
        </button>
      </div>

      {/* User */}
      <div className="border-t border-gray-800 p-4">
        <button
          onClick={() => navigate("/profile")}
          className="flex w-full items-center gap-3 rounded-xl p-2 transition hover:bg-white/5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-lg font-semibold text-white">
            S
          </div>

          <div className="text-left">
            <p className="text-sm font-semibold text-white">Sukesh</p>
            <p className="text-xs text-gray-400">View Profile</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
