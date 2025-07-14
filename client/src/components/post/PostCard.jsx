import { useState } from "react";

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Image,
  X,
  TrendingUp,
  CheckCircle,
  ThumbsDown,
} from "lucide-react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setDisliked(false);
      setLikeCount(likeCount + 1);
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    } else {
      setLiked(false);
      setLikeCount(likeCount - 1);
    }
  };

  const handleDislike = () => {
    if (!disliked) {
      setDisliked(true);
      setLiked(false);
      if (liked) setLikeCount(likeCount - 1);
    } else {
      setDisliked(false);
    }
  };

  const handleDoubleClick = () => {
    if (!liked) {
      handleLike();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 mb-4 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-600">
            <img
              src={post.avatar}
              alt={post.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {post.username}
              </h3>
              {post.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {post.timestamp}
            </p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:scale-95"
          >
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          {showOptions && (
            <div className="absolute right-0 top-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-10 w-32">
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">
                Report
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">
                Hide
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Image */}
      <div className="relative overflow-hidden">
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
          onDoubleClick={handleDoubleClick}
        />
        {/* Double-tap heart animation */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="w-20 h-20 text-white drop-shadow-lg animate-pulse fill-current" />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center active:scale-125 transition-transform"
            >
              <Heart
                className={`w-7 h-7 transition-colors ${
                  liked
                    ? "text-red-500 fill-current"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              />
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center active:scale-125 transition-transform"
            >
              <MessageCircle className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </button>

            <button className="flex items-center active:scale-125 transition-transform">
              <Share2 className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={handleDislike}
              className="flex items-center active:scale-125 transition-transform"
            >
              <ThumbsDown
                className={`w-7 h-7 transition-colors ${
                  disliked ? "text-red-500" : "text-gray-700 dark:text-gray-300"
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="active:scale-125 transition-transform"
          >
            <Bookmark
              className={`w-7 h-7 transition-colors ${
                bookmarked
                  ? "text-blue-500 fill-current"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            />
          </button>
        </div>

        {/* Like Count */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">
            {likeCount.toLocaleString()} likes
          </span>
          <TrendingUp className="w-4 h-4 text-green-500" />
        </div>

        {/* Caption */}
        <div className="text-gray-900 dark:text-white">
          <span className="font-semibold">{post.username}</span>
          <span className="ml-2">{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 dark:text-gray-400 mt-2 text-sm hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            View all {post.comments} comments
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
