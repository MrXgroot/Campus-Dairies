import { create } from "zustand";
import api from "../utils/api";

const useProfileStore = create((set) => ({
  profile: null,
  posts: [],
  tagged: [],
  loading: true,

  // Get logged-in user's profile
  fetchProfile: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/auth/me");
      set({ profile: res.data });
    } catch (err) {
      console.error("Fetch profile failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Update name or profile image
  updateProfile: async (updatedFields) => {
    try {
      set({ loading: true });
      const res = await api.put("/users/update", updatedFields);
      set({ profile: res.data });
    } catch (err) {
      console.error("Update profile failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Get user's uploaded posts
  fetchUploadedPosts: async () => {
    try {
      const res = await api.get("/posts/my-uploads");
      console.log(res.data);
      set({ posts: res.data });
    } catch (err) {
      console.error("Fetch uploaded posts failed:", err);
    }
  },

  // Get posts user is tagged in
  fetchTaggedPosts: async () => {
    try {
      const res = await api.get("/posts/tagged");
      set({ tagged: res.data });
    } catch (err) {
      console.error("Fetch tagged posts failed:", err);
    }
  },

  // Clear profile data
  clearProfile: () => {
    set({
      profile: null,
      uploadedPosts: [],
      tagged: [],
    });
  },
}));

export default useProfileStore;
