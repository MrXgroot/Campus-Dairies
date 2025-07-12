import { create } from "zustand";
import api from "../utils/api";

const usePostStore = create((set) => ({
  posts: [],
  loading: false,

  fetchPosts: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/posts");
      set({ posts: res.data });
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      set({ loading: false });
    }
  },

  uploadPost: async (formData) => {
    try {
      const res = await api.post("/posts/upload", formData);
      set((state) => ({
        posts: [res.data, ...state.posts],
      }));
    } catch (err) {
      console.error("Post upload failed:", err);
    }
  },

  reactToPost: async (postId, emoji) => {
    try {
      await api.post(`/posts/${postId}/react`, { emoji });
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
