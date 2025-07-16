import { create } from "zustand";
import api from "../utils/api";

const usePostStore = create((set, get) => ({
  loading: false,
  publicPosts: [],
  groupPosts: [],
  currentPage: 1,
  groupPage: 1,
  limit: 12,
  hasMore: true,
  hasMoreGroup: true,

  // Reset public pagination state
  resetPagination: () => {
    set({
      publicPosts: [],
      currentPage: 1,
      hasMore: true,
    });
  },

  // Reset group pagination state
  resetGroupPagination: () => {
    set({
      groupPosts: [],
      groupPage: 1,
      hasMoreGroup: true,
    });
  },

  // ✅ Fetch public posts with pagination
  fetchPublicPosts: async () => {
    const { currentPage, limit, publicPosts } = get();
    set({ loading: true });

    try {
      const res = await api.get(
        `/posts/public?page=${currentPage}&limit=${limit}`
      );
      const newPosts = res.data;

      set({
        publicPosts: [...publicPosts, ...newPosts],
        hasMore: newPosts.length === limit,
        currentPage: currentPage + 1,
      });
    } catch (err) {
      console.error("Failed to fetch public posts:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Fetch group posts with pagination
  fetchGroupPosts: async (groupId) => {
    const { groupPage, limit, groupPosts } = get();
    set({ loading: true });

    try {
      const res = await api.get(
        `/posts/group/${groupId}?page=${groupPage}&limit=${limit}`
      );
      const newPosts = res.data;

      set({
        groupPosts: [...groupPosts, ...newPosts],
        hasMoreGroup: newPosts.length === limit,
        groupPage: groupPage + 1,
      });
    } catch (err) {
      console.error("Failed to fetch group posts:", err);
    } finally {
      set({ loading: false });
    }
  },

  // 🆕 Report a post (toggle like/dislike style)
  reportPost: async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/report`);
      const updatedPost = res.data?.post;

      if (updatedPost) {
        set((state) => ({
          publicPosts: state.publicPosts.map((post) =>
            post._id === postId ? updatedPost : post
          ),
          groupPosts: state.groupPosts.map((post) =>
            post._id === postId ? updatedPost : post
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to report post:", err);
    }
  },

  // Already existing logic:
  uploadPost: async (formData) => {
    try {
      const res = await api.post("/posts/upload", formData);
      const newPost = res.data;

      if (formData.groupId === "public") {
        set((state) => ({
          publicPosts: [newPost, ...state.publicPosts],
        }));
      } else {
        set((state) => ({
          groupPosts: [newPost, ...state.groupPosts],
        }));
      }
    } catch (err) {
      console.error("Post upload failed:", err);
    }
  },

  reactToPost: async (postId, reactionType) => {
    try {
      const res = await api.post(`/posts/${postId}/react`, { reactionType });
      const updatedPost = res.data.post;

      set((state) => ({
        publicPosts: state.publicPosts.map((post) =>
          post._id === postId ? updatedPost : post
        ),
        groupPosts: state.groupPosts.map((post) =>
          post._id === postId ? updatedPost : post
        ),
      }));
    } catch (err) {
      console.error("Failed to react:", err);
    }
  },

  commentOnPost: async (postId, comment) => {
    try {
      await api.post(`/posts/${postId}/comment`, { text: comment });
    } catch (err) {
      console.error("Failed to comment:", err);
    }
  },
}));

export default usePostStore;
