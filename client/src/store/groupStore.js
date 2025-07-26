import { create } from "zustand";
import api from "../utils/api";

const useGroupStore = create((set, get) => ({
  joinedGroups: [],
  otherGroups: [],
  groupDetails: null,
  groupPosts: [],
  loading: false,

  // Create a group and refresh joined groups
  createGroup: async (groupData) => {
    try {
      const res = await api.post("/groups/create", groupData);
      console.log("Group created:", res.data);
      await get().fetchJoinedGroups();
    } catch (err) {
      console.error("Create group failed:", err);
    }
  },

  // Fetch groups the user has joined
  fetchJoinedGroups: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/groups/my");
      console.log(res.data);
      set({ joinedGroups: res.data });
    } catch (err) {
      console.error("Fetch joined groups failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchGroupById: async (groupId) => {
    try {
      set({ loading: true });
      const res = await api.get(`/groups/${groupId}`);
      set({ groupDetails: res.data });
    } catch (err) {
      console.error("Fetch group by id failed", err);
    } finally {
      set({ loading: false });
    }
  },

  // Fetch discoverable (not joined) groups
  fetchDiscoverGroups: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/groups/discover");
      set({ otherGroups: res.data });
    } catch (err) {
      console.error("Fetch discover groups failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Join a group and refresh both lists
  requestToJoinGroup: async (groupId) => {
    try {
      const res = await api.post(`/groups/${groupId}/request`);
      console.log("Join request sent:", res.data);
    } catch (err) {
      console.error("Join request failed:", err.response?.data || err);
    }
  },

  acceptJoinRequest: async (groupId, userId, notificationId) => {
    try {
      const res = await api.post(`/groups/${groupId}/accept`, {
        userId,
        notificationId,
      });
      console.log("Join request accepted:", res.data);
      await get().fetchGroupDetails(groupId);
    } catch (err) {
      console.error("Accept join request failed:", err.response?.data || err);
    }
  },

  // Leave a group and refresh both lists
  leaveGroup: async (groupId) => {
    try {
      await api.post(`/groups/${groupId}/leave`);
      await Promise.all([
        get().fetchJoinedGroups(),
        get().fetchDiscoverGroups(),
      ]);
    } catch (err) {
      console.error("Leave group failed:", err);
    }
  },

  // Fetch details of a specific group
  fetchGroupDetails: async (groupId) => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      set({ groupDetails: res.data });
    } catch (err) {
      console.error("Fetch group details failed:", err);
    }
  },

  // Fetch posts of a specific group
  fetchGroupPosts: async (groupId) => {
    try {
      const res = await api.get(`/posts/group/${groupId}`);
      set({ groupPosts: res.data });
    } catch (err) {
      console.error("Fetch group posts failed:", err);
    }
  },

  // Clear group-related state (e.g., on navigation or logout)
  clearGroupData: () => {
    set({ groupDetails: null, groupPosts: [] });
  },
}));

export default useGroupStore;
