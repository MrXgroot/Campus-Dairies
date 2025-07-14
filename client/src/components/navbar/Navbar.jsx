import React from "react";
import { Home, Users, Plus, Bell, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onCreatePostClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#111827] to-[#1f2937] border-t border-gray-800">
      <div className="max-w-md mx-auto px-6 py-2 flex justify-between items-center">
        {/* Home */}
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center transition-colors ${
            isActive("/")
              ? "text-blue-400"
              : "text-gray-400 hover:text-blue-400"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Groups */}
        <button
          onClick={() => navigate("/groups")}
          className={`flex flex-col items-center transition-colors ${
            isActive("/groups")
              ? "text-purple-400"
              : "text-gray-400 hover:text-purple-400"
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Groups</span>
        </button>

        {/* Create Post (Center Button) */}
        <button
          onClick={onCreatePostClick}
          className="flex flex-col items-center text-white hover:text-green-400 transition-colors"
        >
          <Plus className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Post</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className={`flex flex-col items-center transition-colors ${
            isActive("/notifications")
              ? "text-yellow-400"
              : "text-gray-400 hover:text-yellow-400"
          }`}
        >
          <Bell className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Alerts</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className={`flex flex-col items-center transition-colors ${
            isActive("/profile")
              ? "text-pink-400"
              : "text-gray-400 hover:text-pink-400"
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
