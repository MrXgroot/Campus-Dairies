import React, { useState, useEffect } from "react";
import {
  Search,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Download,
  Loader2,
} from "lucide-react";
import useLoaderStore from "../../store/loaderStore";

const Header = ({ searchTerm, setSearchTerm, placeholder }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    isUploading,
    isCompressing,
    uploadProgress,
    uploadStatus,
    compressionProgress,
    getCurrentLoadingMessage,
    isLoading,
  } = useLoaderStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    const newTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    localStorage.setItem("theme", newTheme);
    setDarkMode(newTheme === "dark");
  };

  const toggleFullScreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const iconActions = [
    {
      icon: darkMode ? Sun : Moon,
      label: "Toggle Theme",
      onClick: toggleDarkMode,
    },
    {
      icon: isFullscreen ? Minimize2 : Maximize2,
      label: "Fullscreen",
      onClick: toggleFullScreen,
    },
  ];

  // Get the current loading state and progress
  const currentMessage = getCurrentLoadingMessage();
  const showProgress = isLoading();

  // Determine progress percentage and color
  let progressPercentage = 0;
  let progressColor =
    "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500";

  if (isCompressing) {
    progressPercentage = compressionProgress.progress || 0;

    switch (compressionProgress.phase) {
      case "downloading":
        progressColor =
          "bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600";
        break;
      case "compressing":
        progressColor =
          "bg-gradient-to-r from-green-500 via-blue-500 to-purple-500";
        break;
      case "complete":
        progressColor = "bg-gradient-to-r from-green-400 to-green-600";
        break;
      case "error":
        progressColor = "bg-gradient-to-r from-red-500 to-red-600";
        break;
      default:
        progressColor =
          "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500";
    }
  } else if (isUploading) {
    progressPercentage = uploadProgress;
    progressColor =
      "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500";
  }

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
            CampusDiary
          </h1>
          <div className="flex items-center gap-2">
            {iconActions.map(({ icon: Icon, label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:scale-95"
                aria-label={label}
              >
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder || "Search posts..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={showProgress}
          />
        </div>
      </div>

      {/* Progress Section */}
      {showProgress && (
        <div className="px-4 pb-3">
          {/* Status Message */}
          {currentMessage && (
            <div className="flex items-center justify-center mb-2 text-sm text-gray-600 dark:text-gray-300">
              {compressionProgress.phase === "downloading" && (
                <Download className="w-4 h-4 mr-2 animate-bounce" />
              )}
              {isCompressing && compressionProgress.phase !== "downloading" && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              <span className="font-medium">{currentMessage}</span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ease-out ${progressColor}`}
              style={{ width: `${Math.max(progressPercentage, 5)}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Progress Percentage */}
          {progressPercentage > 0 && (
            <div className="text-center mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Simple Progress Line (fallback) */}
      {!showProgress && (isUploading || isCompressing) && (
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
      )}
    </div>
  );
};

export default Header;
