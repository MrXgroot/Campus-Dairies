// stores/notificationStore.js
import { create } from "zustand";
import api from "../utils/api"; // Make sure this points to your Axios instance

const useNotificationStore = create((set, get) => ({
  notifications: [],
  hasUnread: false,
  loading: false,
  // ✅ Fetch from DB
  fetchNotifications: async () => {
    try {
      const res = await api.get("/notifications");
      const notifs = res.data.notifications || [];
      set({
        notifications: notifs,
      });
    } catch (err) {
      console.error("Fetch notifications failed:", err);
    } finally {
      set({ loading: false });
    }
  },
  // ✅ Delete a single notification
  deleteNotification: async (notifId) => {
    try {
      await api.delete(`/notifications/${notifId}`);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== notifId),
      }));
    } catch (err) {
      console.error("Delete notification failed:", err);
    }
  },

  // ✅ Delete all notifications
  deleteAllNotifications: async () => {
    try {
      await api.delete("/notifications");
      set({ notifications: [] });
    } catch (err) {
      console.error("Delete all notifications failed:", err);
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
