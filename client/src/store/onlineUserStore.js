// store/onlineUserStore.js
import { create } from "zustand";

const useOnlineUserStore = create((set) => ({
  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));

export default useOnlineUserStore;
