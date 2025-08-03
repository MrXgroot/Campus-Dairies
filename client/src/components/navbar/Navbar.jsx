import React from "react";
import { Home, Users, Plus, Bell, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useSocketMessageStore from "../../store/socketMessageStore";

const Navbar = ({ onCreatePostClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { newNotification } = useSocketMessageStore();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-md">
      <div className="max-w-md mx-auto px-6 py-2 flex justify-between items-center">
        {/* Home */}
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center transition-colors ${
            isActive("/")
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
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
              ? "text-purple-600 dark:text-purple-400"
              : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Groups</span>
        </button>

        {/* Create Post */}
        <button
          onClick={() => navigate("/messagewall")}
          className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          <Plus className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">message</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className={`relative flex flex-col items-center transition-colors ${
            isActive("/notifications")
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
          }`}
        >
          <Bell className="w-6 h-6" />
          {newNotification && (
            <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900" />
          )}
          <span className="text-[10px] mt-0.5">Alerts</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className={`flex flex-col items-center transition-colors ${
            isActive("/profile")
              ? "text-pink-600 dark:text-pink-400"
              : "text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
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
