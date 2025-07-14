import { create } from "zustand";
import api from "../utils/api";

const useGroupStore = create((set, get) => ({
  groups: [],
  joinedGroups: [],
  otherGroups: [],
  groupDetails: null,
  groupPosts: [],
  loading: false,

  // Fetch all groups
  fetchGroups: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/groups");
      const all = res.data;

      const joined = all.filter((g) => g.isJoined);
      const others = all.filter((g) => !g.isJoined);

      set({ groups: all, joinedGroups: joined, otherGroups: others });
    } catch (err) {
      console.error("Fetch groups failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Join a group
  joinGroup: async (groupId) => {
    try {
      await api.post(`/groups/${groupId}/join`);
      get().fetchGroups(); // Refresh groups
    } catch (err) {
      console.error("Join group failed:", err);
    }
  },

  // Create a group
  createGroup: async (groupData) => {
    try {
      await api.post("/groups/create", groupData);
      get().fetchGroups();
    } catch (err) {
      console.error("Create group failed:", err);
    }
  },

  // Fetch full group details (admin, members, stats)
  fetchGroupDetails: async (groupId) => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      set({ groupDetails: res.data });
    } catch (err) {
      console.error("Fetch group details failed:", err);
    }
  },

  // Fetch posts from a private group
  fetchGroupPosts: async (groupId) => {
    try {
      const res = await api.get(`/posts/group/${groupId}`);
      set({ groupPosts: res.data });
    } catch (err) {
      console.error("Fetch group posts failed:", err);
    }
  },

  leaveGroup: async (groupId) => {
    try {
      await api.post(`/groups/${groupId}/leave`);
      get().fetchGroups(); // Refresh after leaving
    } catch (err) {
      console.error("Leave group failed:", err);
    }
  },

  clearGroupData: () => {
    set({ groupDetails: null, groupPosts: [] });
  },
}));

export default useGroupStore;
