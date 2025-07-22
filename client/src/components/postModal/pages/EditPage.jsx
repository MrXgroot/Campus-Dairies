import React from "react";
import { ArrowLeft, X } from "lucide-react";

const EditPage = ({
  mediaType,
  imagePreview,
  setCaption,
  handleShowTaggedPopup,
  taggedUsers,
  removeTag,
  caption,
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Image Preview */}
      <div className="flex-1 bg-black flex items-center justify-center">
        <div className="w-full max-w-md aspect-square">
          {mediaType === "image" ? (
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <video
              src={imagePreview}
              autoPlay
              loop
              playsInline
              controls
              className="w-full h-full object-contain rounded-md"
            />
          )}
        </div>
      </div>

      {/* Caption and Options */}
      <div className="bg-white dark:bg-gray-900 p-4 space-y-4 max-h-80 overflow-y-auto sticky bottom-0 w-full ">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Your avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none border-none outline-none text-sm"
            rows={3}
          />
        </div>

        {/* Tag People */}
        <button
          onClick={handleShowTaggedPopup}
          className="flex items-center justify-between w-full py-3 text-left border-t border-gray-200 dark:border-gray-700"
        >
          <span className="text-gray-900 dark:text-white text-sm">
            Tag people
          </span>
          <div className="flex items-center gap-2">
            {taggedUsers.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {taggedUsers.length} tagged
              </span>
            )}
            <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
          </div>
        </button>

        {/* Tagged Users Display */}
        {taggedUsers.length > 0 && (
          <div className="space-y-2">
            {taggedUsers.map((user) => (
              <div
                key={user.username}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.fullName}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeTag(user.username)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPage;
