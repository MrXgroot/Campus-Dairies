import React from "react";
import { X, ImageIcon, ArrowLeft } from "lucide-react";
const SelectFilePage = ({ fileInputRef, handleMediaUpload }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-light text-gray-900 dark:text-white mb-2">
            Select photos and videos
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Share up to 10 photos and videos
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Select from device
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleMediaUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectFilePage;
