import React, { useState, useEffect } from "react";
import { Search, Plus, RefreshCw } from "lucide-react";

const Header = ({
  searchTerm,
  setSearchTerm,
  onRefresh,
  refreshing,
  setShowCreatePost,
}) => (
  <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div className="max-w-md mx-auto px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
          CampusDairies
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:scale-95"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>
          <button
            onClick={() => setShowCreatePost(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:scale-95"
          >
            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
    </div>
  </div>
);

export default Header;
