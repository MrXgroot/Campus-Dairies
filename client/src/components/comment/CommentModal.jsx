import { useState, useEffect, useRef } from "react";
import { X, Heart, MoreVertical, Send } from "lucide-react";
const CommentModal = ({ isOpen, onClose, post }) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        username: "alice_wonder",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b9e5d2f0?w=32&h=32&fit=crop&crop=face&round=true",
        isVerified: true,
      },
      text: "This is amazing! Love the composition 📸",
      timestamp: "2h",
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: 11,
          user: {
            username: "bob_photographer",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&round=true",
          },
          text: "I agree! The lighting is perfect",
          timestamp: "1h",
          likes: 3,
          isLiked: true,
          replyingTo: "alice_wonder",
        },
      ],
    },
    {
      id: 2,
      user: {
        username: "creative_soul",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face&round=true",
      },
      text: "Stunning work! 🔥🔥",
      timestamp: "3h",
      likes: 8,
      isLiked: true,
      replies: [],
    },
    {
      id: 3,
      user: {
        username: "art_lover99",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face&round=true",
      },
      text: "Can you share the camera settings you used for this shot?",
      timestamp: "4h",
      likes: 5,
      isLiked: false,
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);

  const modalRef = useRef(null);
  const commentInputRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleMouseUp = () => {
    if (dragY > 100) {
      onClose();
    }
    setIsDragging(false);
    setDragY(0);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      onClose();
    }
    setIsDragging(false);
    setDragY(0);
  };

  const handleLikeComment = (commentId, isReply = false, parentId = null) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    isLiked: !reply.isLiked,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  }
                : reply
            ),
          };
        } else if (!isReply && comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: {
        username: "current_user",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face&round=true",
      },
      text: newComment,
      timestamp: "now",
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const handleReply = (commentId, username) => {
    setReplyingTo({ commentId, username });
    setTimeout(() => commentInputRef.current?.focus(), 100);
  };

  const handleAddReply = () => {
    if (!replyText.trim() || !replyingTo) return;

    const reply = {
      id: Date.now(),
      user: {
        username: "current_user",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face&round=true",
      },
      text: replyText,
      timestamp: "now",
      likes: 0,
      isLiked: false,
      replyingTo: replyingTo.username,
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === replyingTo.commentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );

    setReplyText("");
    setReplyingTo(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (replyingTo) {
        handleAddReply();
      } else {
        handleAddComment();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex items-end sm:items-center justify-center z-100 ">
      <div
        ref={modalRef}
        className="bg-white rounded-t-2xl dark:bg-gray-800 w-full sm:w-96 sm:max-w-lg h-[85vh] sm:h-[600px] sm:rounded-lg flex flex-col overflow-hidden"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="w-8"></div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Comments
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Drag indicator */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {comments.map((comment) => (
            <div key={comment.id} className="mb-4">
              {/* Main comment */}
              <div className="flex items-start gap-3 mb-2">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                      {comment.user.username}
                    </span>
                    {comment.user.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white mb-2">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <Heart
                        className={`w-3 h-3 ${
                          comment.isLiked ? "text-red-500 fill-current" : ""
                        }`}
                      />
                      {comment.likes > 0 && <span>{comment.likes}</span>}
                    </button>
                    <button
                      onClick={() =>
                        handleReply(comment.id, comment.user.username)
                      }
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Reply
                    </button>
                    <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-11 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3">
                      <img
                        src={reply.user.avatar}
                        alt={reply.user.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            {reply.user.username}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {reply.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white mb-2">
                          <span className="text-blue-500">
                            @{reply.replyingTo}
                          </span>{" "}
                          {reply.text}
                        </p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() =>
                              handleLikeComment(reply.id, true, comment.id)
                            }
                            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          >
                            <Heart
                              className={`w-3 h-3 ${
                                reply.isLiked ? "text-red-500 fill-current" : ""
                              }`}
                            />
                            {reply.likes > 0 && <span>{reply.likes}</span>}
                          </button>
                          <button
                            onClick={() =>
                              handleReply(comment.id, reply.user.username)
                            }
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {replyingTo && (
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Replying to @{replyingTo.username}</span>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face&round=true"
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 flex items-center gap-2">
              <input
                ref={commentInputRef}
                type="text"
                placeholder={
                  replyingTo
                    ? `Reply to ${replyingTo.username}...`
                    : "Add a comment..."
                }
                value={replyingTo ? replyText : newComment}
                onChange={(e) =>
                  replyingTo
                    ? setReplyText(e.target.value)
                    : setNewComment(e.target.value)
                }
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
              <button
                onClick={replyingTo ? handleAddReply : handleAddComment}
                disabled={!(replyingTo ? replyText.trim() : newComment.trim())}
                className="p-2 rounded-full bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
