import { create } from "zustand";
import api from "../utils/api";

const useGroupStore = create((set) => ({
  groups: [],
  activeGroup: null,
  groupPosts: [],
  groupStats: {},
  loading: false,

  fetchGroups: async () => {
    try {
      const res = await api.get("/groups");
      set({ groups: res.data });
    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  },

  joinGroup: async (groupId) => {
    try {
      await api.post(`/groups/${groupId}/join`);
      // Optional: refetch groups or update UI
    } catch (err) {
      console.error("Join failed:", err);
    }
  },

  selectGroup: async (groupId) => {
    try {
      const [groupRes, postsRes, statsRes] = await Promise.all([
        api.get(`/groups/${groupId}`),
        api.get(`/posts/group/${groupId}`),
        api.get(`/groups/${groupId}/stats`),
      ]);
      set({
        activeGroup: groupRes.data,
        groupPosts: postsRes.data,
        groupStats: statsRes.data,
      });
    } catch (err) {
      console.error("Select group failed:", err);
    }
  },
}));

export default useGroupStore;
