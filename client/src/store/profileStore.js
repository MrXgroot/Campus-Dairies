import { create } from "zustand";
import api from "../utils/api";
import toast from "react-hot-toast";
const useProfileStore = create((set) => ({
  profile: null,
  loading: true,

  // Get logged-in user's profile
  fetchProfile: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/users/me");
      set({ profile: res.data });
    } catch (err) {
      console.error("Fetch profile failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Update name or profile image
  updateProfile: async (updatedFields) => {
    console.log(updatedFields);
    try {
      set({ loading: true });
      const res = await api.put("/users/update", updatedFields, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      set({ profile: res.data });
    } catch (err) {
      console.error("Update profile failed:", err);
    } finally {
      set({ loading: false });
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
