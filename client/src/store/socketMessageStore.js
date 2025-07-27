// stores/socketMessageStore.js
import { create } from "zustand";

const useSocketMessageStore = create((set) => ({
  messages: [],
  newMessage: false,
  newNotification: false,
  // Add a new real-time socket message
  addMessage: (msg) => {
    set((state) => ({
      messages: [...state.messages, msg],
      newMessage: true,
      newNotificaton: true,
    }));
  },
  addNewNotification: (msg) => {
    console.log(msg);
    set({
      newNotification: true,
    });
  },
  markAsRead: () => {
    set({ newNotification: false });
  },

  // Remove manually
  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    })),

  // Clear all
  clearMessages: () => set({ messages: [] }),
}));

export default useSocketMessageStore;
