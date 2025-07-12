import { create } from "zustand";
import { io } from "socket.io-client";

const useRealtimeStore = create((set) => ({
  socket: null,
  onlineUsers: [],

  connect: (token) => {
    const socket = io("http://localhost:3000", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected ✅");
    });

    socket.on("onlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = useRealtimeStore.getState();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));

export default useRealtimeStore;
