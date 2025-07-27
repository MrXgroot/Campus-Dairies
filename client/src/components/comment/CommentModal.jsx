import { useState, useEffect, useRef } from "react";
import { X, Heart, MoreVertical, Send } from "lucide-react";
import useCommentStore from "../../store/commentStore";
import useModalStore from "../../store/modalStore";
import { formatDateTime } from "../../utils/formatDate";
import moment from "moment";
const CommentModal = ({ isOpen, onClose }) => {
  // const [comments, setComments] = useState([
  //   {
  //     id: 1,
  //     user: {
  //       username: "alice_wonder",
  //       avatar:
  //         "https://images.unsplash.com/photo-1494790108755-2616b9e5d2f0?w=32&h=32&fit=crop&crop=face&round=true",
  //       isVerified: true,
  //     },
  //     text: "This is amazing! Love the composition 📸",
  //     timestamp: "2h",
  //     likes: 12,
  //     isLiked: false,
  //     replies: [
  //       {
  //         id: 11,
  //         user: {
  //           username: "bob_photographer",
  //           avatar:
  //             "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&round=true",
  //         },
  //         text: "I agree! The lighting is perfect",
  //         timestamp: "1h",
  //         likes: 3,
  //         isLiked: true,
  //         replyingTo: "alice_wonder",
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     user: {
  //       username: "creative_soul",
  //       avatar:
  //         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face&round=true",
  //     },
  //     text: "Stunning work! 🔥🔥",
  //     timestamp: "3h",
  //     likes: 8,
  //     isLiked: true,
  //     replies: [],
  //   },
  //   {
  //     id: 3,
  //     user: {
  //       username: "art_lover99",
  //       avatar:
  //         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face&round=true",
  //     },
  //     text: "Can you share the camera settings you used for this shot?",
  //     timestamp: "4h",
  //     likes: 5,
  //     isLiked: false,
  //     replies: [],
  //   },
  // ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [commentId, setCommentId] = useState(null);

  const loading = useCommentStore((state) => state.loading);
  const comments = useCommentStore((state) => state.comments);
  const addComment = useCommentStore((state) => state.addComment);
  const currentPost = useModalStore((state) => state.currentPost);
  const getComments = useCommentStore((state) => state.getComments);
  const resetComments = useCommentStore((state) => state.resetComments);
  const hasMore = useCommentStore((state) => state.hasMore);

  const replyToComment = useCommentStore((state) => state.replyToComment);
  const modalRef = useRef(null);
  const commentInputRef = useRef(null);

  const observerRef = useRef(null);
  useEffect(() => {
    resetComments();
    getComments(currentPost);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log("fetching");
          getComments(currentPost);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    addComment(currentPost, newComment);
    setNewComment("");
  };

  const handleReply = (commentId, username, userId) => {
    setReplyingTo({ commentId, username, userId });
    setTimeout(() => commentInputRef.current?.focus(), 100);
  };

  const handleAddReply = () => {
    if (!replyText.trim() || !replyingTo) return;
    replyToComment(replyingTo.commentId, replyText, replyingTo.username);
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

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  });

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex items-end sm:items-center justify-center z-100 ">
      <div
        ref={modalRef}
        className="bg-white rounded-t-2xl dark:bg-gray-800 w-full sm:w-96 sm:max-w-lg h-[85vh] sm:h-[600px] sm:rounded-lg flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing">
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
            <div key={comment._id} className="mb-4">
              {/* Main comment */}
              <div className="flex items-start gap-3 mb-2">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                      {comment.user.name}
                    </span>
                    {comment.user.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white mb-2">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        handleReply(
                          comment._id,
                          comment.user.name,
                          comment.user._id
                        )
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
                    <div key={reply._id} className="flex items-start gap-3">
                      <img
                        src={reply.user.avatar}
                        alt={reply.user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            {reply.user.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {moment(reply.createdAt).fromNow()}
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
                              handleReply(comment._id, reply.user.username)
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
          {/* Load More Observer */}
          {hasMore && (
            <div
              ref={observerRef}
              className="h-10 flex justify-center items-center"
            >
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
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
