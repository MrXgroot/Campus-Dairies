import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import moment from "moment";
import VerifiedBadge from "../badges/VerifiedBadge";
import usePostStore from "../../store/postStore";
import useModalStore from "../../store/modalStore";
import useAuthStore from "../../store/authStore";
import Toast from "react-hot-toast";
import useUserStore from "../../store/userStore";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  TrendingUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Hand,
  Send,
} from "lucide-react";

const PostCard = memo(({ post, canDelete, handleDeletePost }) => {
  // State
  const [liked, setLiked] = useState(post.isLiked);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPausedByHold, setIsPausedByHold] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const clickTimeout = useRef(null);
  const optionsRef = useRef(null);

  // Store hooks
  const reactToPost = usePostStore((state) => state.toggleLikePost);
  const openCommentModal = useModalStore((state) => state.openCommentModal);
  const user = useAuthStore((state) => state.user);
  const { sendWaveToUser } = useUserStore();

  // Memoized values
  const timeAgo = useMemo(
    () => moment(post.createdAt).fromNow(),
    [post.createdAt]
  );

  const [likesCount, setLikesCount] = useState(post.likes.length);

  const commentsCount = useMemo(
    () => post.comments.length,
    [post.comments.length]
  );

  const hasTaggedUsers = useMemo(
    () => post.taggedUsers.length > 0,
    [post.taggedUsers.length]
  );

  const canDeletePost = useMemo(
    () => canDelete || user?.isVerified,
    [canDelete, user?.isVerified]
  );

  // Callbacks
  const handleLike = useCallback(() => {
    setLiked((prev) => !prev);

    if (!liked) {
      setLikesCount((prev) => prev + 1);
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    } else {
      setLikesCount((prev) => prev - 1);
    }
  }, [liked, post._id]);

  const handleClick = useCallback(() => {
    if (clickTimeout.current) return;

    clickTimeout.current = setTimeout(() => {
      setIsMuted((prev) => !prev);
      clickTimeout.current = null;
    }, 250);
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    if (!liked) handleLike();
  }, [liked, handleLike]);

  const handleLongPressStart = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPausedByHold(true);
    }
  }, []);

  const handleLongPressEnd = useCallback(() => {
    const video = videoRef.current;
    if (video && isPausedByHold) {
      video.play().catch(() => {});
      setIsPausedByHold(false);
    }
  }, [isPausedByHold]);

  const handleClickOutside = useCallback((e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target))
      setShowOptions(false);
  }, []);

  const handleOpenComments = useCallback(() => {
    openCommentModal(post._id);
  }, [openCommentModal, post._id]);

  const sendWave = useCallback(() => {
    sendWaveToUser(post.createdBy._id);
    Toast.success(`Sent hi to ${post.createdBy.username}`);
  }, [sendWaveToUser, post.createdBy._id, post.createdBy.username]);

  const toggleOptions = useCallback(() => {
    setShowOptions((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleDisliked = useCallback(() => {
    setDisliked((prev) => !prev);
  }, []);

  const toggleBookmarked = useCallback(() => {
    setBookmarked((prev) => !prev);
  }, []);

  const handleReport = useCallback(() => {
    console.log("Report");
  }, []);

  const handleHide = useCallback(() => {
    console.log("Hide");
  }, []);

  const handleDelete = useCallback(() => {
    handleDeletePost(post._id);
  }, [handleDeletePost, post._id]);

  // Effects
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const video = videoRef.current;
        if (!video) return;

        if (entries[0].isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.75 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-gray-800 mb-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
    >
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
              {timeAgo}
            </p>
          </div>
        </div>
        <div ref={optionsRef} className="relative">
          <button
            onClick={toggleOptions}
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
              <button
                onClick={handleHide}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
              >
                Hide
              </button>
              {canDeletePost && (
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media */}
      <div className="relative bg-white dark:bg-black overflow-hidden">
        {post.type === "video" ? (
          <video
            ref={videoRef}
            src={post.mediaUrl}
            muted={isMuted}
            loop
            onDoubleClick={handleDoubleClick}
            onTouchStart={handleLongPressStart}
            onTouchEnd={handleLongPressEnd}
            onMouseDown={handleLongPressStart}
            onMouseUp={handleLongPressEnd}
            onClick={handleClick}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-80 object-contain cursor-pointer hover:scale-105 transition-transform"
          />
        ) : (
          <img
            src={post.mediaUrl}
            alt="Post"
            draggable={false}
            onDoubleClick={handleDoubleClick}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-80 object-contain cursor-pointer hover:scale-105 transition-transform"
          />
        )}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-20 h-20 text-white drop-shadow-lg animate-pulse fill-current" />
          </div>
        )}

        {/* Mute Button */}
        {post.type === "video" && (
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
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
              onClick={handleOpenComments}
              className="active:scale-125 transition-transform "
            >
              <MessageCircle className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </button>
            <button className="active:scale-125 transition-transform">
              <Share2 className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={toggleDisliked}
              className="active:scale-125 transition-transform"
            >
              <Send
                onClick={sendWave}
                className={`w-7 h-7 ${
                  disliked ? "text-red-500" : "text-gray-700 dark:text-gray-300"
                }`}
              />
            </button>
          </div>
          <button
            onClick={toggleBookmarked}
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
            {likesCount} likes
          </span>
          <TrendingUp className="w-4 h-4 text-green-500" />
        </div>

        {/* Caption */}
        <div className="text-gray-900 dark:text-white">
          <span className="font-semibold">{post.createdBy.username}</span>
          <span className="ml-2">{post.caption}</span>
        </div>

        {hasTaggedUsers &&
          post.taggedUsers.map((taggedUser) => (
            <div
              key={taggedUser._id}
              className="text-gray-900 dark:text-white mt-2"
            >
              <span className="font-semibold text-blue-400">
                @{taggedUser.username}
              </span>
            </div>
          ))}

        {/* Comments */}
        {commentsCount > 0 && (
          <button
            onClick={handleOpenComments}
            className="text-sm text-gray-500 dark:text-gray-400 mt-2 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {`View all ${commentsCount} comments`}
          </button>
        )}
      </div>
    </div>
  );
});

PostCard.displayName = "PostCard";

export default PostCard;
