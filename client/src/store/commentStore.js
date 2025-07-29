import { create } from "zustand";
import api from "../utils/api"; // Axios instance with baseURL
import toast from "react-hot-toast";

const useCommentStore = create((set, get) => ({
  comments: [],
  page: 1,
  limit: 16,
  hasMore: true,
  loading: false,
  postId: null,

  // Fetch initial comments or next page
  getComments: async (postId) => {
    const { page, limit, hasMore, loading, comments } = get();
    if (loading || !hasMore) return;
    try {
      set({ loading: true });

      const res = await api.get(
        `/comments/${postId}?page=${page}&limit=${limit}`
      );
      const newComments = res.data.comments;
      console.log(newComments);
      set((state) => ({
        comments: [...comments, ...newComments],
        page: page + 1,
        hasMore: newComments.length === limit,
        postId,
        loading: false,
      }));
    } catch (err) {
      toast.error("Failed to load comments");
      console.log(err);
      set({ loading: false });
    }
  },

  addComment: async (postId, text, user) => {
    const tempId = Date.now().toString(); // Temporary unique ID
    const tempComment = {
      _id: tempId,
      postId,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: [],
      replies: [],
      replyCount: 0,
      user: {
        _id: user._id,
        name: user.username,
        avatar: user.avatar || "",
        isVerified: user.isVerified,
      },
      isTemporary: true, // Mark as temp
    };

    // Optimistically update UI
    set((state) => ({
      comments: [tempComment, ...state.comments],
    }));

    try {
      const res = await api.post(`/comments/${postId}`, { text });
      const newComment = res.data;

      // Replace temp comment with actual comment
      set((state) => ({
        comments: state.comments.map((c) =>
          c._id === tempId ? newComment : c
        ),
      }));
    } catch (err) {
      // On error, remove the temporary comment
      set((state) => ({
        comments: state.comments.filter((c) => c._id !== tempId),
      }));
      toast.error("Failed to add comment");
    }
  },
  // Add a reply to a specific comment
  replyToComment: async (commentId, text, replyingTo = "", user) => {
    const tempId = Date.now().toString();
    const tempReply = {
      _id: tempId,
      commentId,
      text,
      replyingTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        _id: user._id,
        name: user.username,
        avatar: user.avatar || "",
        isVerified: user.isVerified,
      },
      isTemporary: true,
    };

    // Optimistically add the reply
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              replies: [...(comment.replies || []), tempReply],
            }
          : comment
      ),
    }));

    try {
      const res = await api.post(`/comments/reply/${commentId}`, {
        text,
        replyingTo,
      });

      const newReply = res.data;

      // Replace temporary reply with actual reply
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((r) =>
                  r._id === tempId ? newReply : r
                ),
              }
            : comment
        ),
      }));
    } catch (err) {
      // On error, remove the temporary reply
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter((r) => r._id !== tempId),
              }
            : comment
        ),
      }));
      toast.error("Failed to reply");
    }
  },
  // Optional: reset state when switching posts
  resetComments: () =>
    set({
      comments: [],
      page: 1,
      hasMore: true,
      loading: false,
      postId: null,
    }),
}));

export default useCommentStore;
