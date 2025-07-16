import { useState, useEffect } from "react";
import { formatDateTime } from "../../utils/formatDate";
import VerifiedBadge from "../badges/VerifiedBadge";
import usePostStore from "../../store/postStore";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  TrendingUp,
  ThumbsDown,
} from "lucide-react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.isHearted);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  const reactToPost = usePostStore((state) => state.reactToPost);

  useEffect(() => {
    setLiked(post.isHearted); // Sync when post updates from Zustand
  }, [post.isHearted]);

  const handleLike = () => {
    setLiked((prev) => !prev);
    reactToPost(post._id, "hearts");

    // Animate only when liking
    if (!liked) {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }
  };

  const handleDoubleClick = () => {
    if (!liked) handleLike();
  };

  const handleReport = () => {
    console.log("calling");
  };
  return (
    <div className="bg-white dark:bg-gray-800 mb-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-300 dark:ring-gray-600">
            <img
              src={post.createdBy.avatar}
              alt="avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {post.createdBy.username}
              </h3>
              {post.createdBy.isVerified && <VerifiedBadge />}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDateTime(post.updatedAt)}
            </p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          {showOptions && (
            <div className="absolute right-0 top-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-10 w-32">
              <button
                onClick={handleReport}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
              >
                Report
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm">
                Hide
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media */}
      <div className="relative bg-black">
        <img
          src={post.mediaUrl}
          alt="Post"
          onDoubleClick={handleDoubleClick}
          className="w-full h-80 object-contain cursor-pointer hover:scale-105 transition-transform"
        />
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-20 h-20 text-white drop-shadow-lg animate-pulse fill-current" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="active:scale-125 transition-transform"
            >
              <Heart
                className={`w-7 h-7 ${
                  liked
                    ? "text-red-500 fill-current"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="active:scale-125 transition-transform"
            >
              <MessageCircle className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </button>
            <button className="active:scale-125 transition-transform">
              <Share2 className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setDisliked(!disliked)}
              className="active:scale-125 transition-transform"
            >
              <ThumbsDown
                className={`w-7 h-7 ${
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
              className={`w-7 h-7 ${
                bookmarked
                  ? "text-blue-500 fill-current"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            />
          </button>
        </div>

        {/* Reactions Count */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">
            {post.reactions.hearts.length} likes
          </span>
          <TrendingUp className="w-4 h-4 text-green-500" />
        </div>

        {/* Caption */}
        <div className="text-gray-900 dark:text-white">
          <span className="font-semibold">{post.createdBy.username}</span>
          <span className="ml-2">{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-500 dark:text-gray-400 mt-2 hover:text-gray-700 dark:hover:text-gray-200"
          >
            View all {post.comments.length} comments
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
