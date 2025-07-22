// userStore.js
import { create } from "zustand";
import api from "../utils/api";
import toast from "react-hot-toast";

const useUserStore = create((set) => ({
  people: [],
  loadingPeople: false,

  fetchTaggableUsers: async (query = "") => {
    set({ loadingPeople: true });
    try {
      const res = await api.get(`/users/taggable?search=${query}`);
      set({ people: res.data });
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error("fetchTaggableUsers error:", err);
    } finally {
      set({ loadingPeople: false });
    }
  },
}));

export default useUserStore;
