// stores/notificationStore.js
import { create } from "zustand";
import api from "../utils/api"; // Make sure this points to your Axios instance

const useNotificationStore = create((set) => ({
  notifications: [],
  hasUnread: false,

  // ✅ Add a notification (via socket)
  addNotification: (notif) => {
    console.log("📩 New notification via socket:", notif);
    set((state) => ({
      hasUnread: true,
    }));
    if (notif.type == "wave") {
      set({ notifications: notif });
    }
  },

  // ✅ Fetch from DB
  fetchNotifications: async () => {
    try {
      const res = await api.get("/notifications");

      const notifs = res.data.notifications || [];
      console.log(notifs);
      set({
        notifications: notifs,
      });
    } catch (err) {
      console.error("Fetch notifications failed:", err);
    }
  },

  // ✅ Mark all as read
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        isRead: true,
      })),
      hasUnread: false,
    })),
}));

export default useNotificationStore;
