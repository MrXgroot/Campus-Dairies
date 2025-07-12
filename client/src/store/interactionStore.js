// store/interactionStore.js
import { create } from "zustand";
import api from "../utils/api";
import useSocketStore from "./useRealtimeStore";

const useInteractionStore = create((set, get) => ({
  loading: false,

  sendWave: async (targetUserId) => {
    try {
      set({ loading: true });
      await api.post(`/users/${targetUserId}/wave`);
      const socket = useSocketStore.getState().socket;
      if (socket) socket.emit("wave:send", { to: targetUserId });
    } catch (err) {
      console.error("Wave failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  sendHeart: async (targetUserId) => {
    try {
      set({ loading: true });
      await api.post(`/users/${targetUserId}/heart`);
      const socket = useSocketStore.getState().socket;
      if (socket) socket.emit("heart:send", { to: targetUserId });
    } catch (err) {
      console.error("Heart failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  sendStar: async (targetUserId) => {
    try {
      set({ loading: true });
      await api.post(`/users/${targetUserId}/star`);
    } catch (err) {
      console.error("Star failed:", err);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useInteractionStore;
