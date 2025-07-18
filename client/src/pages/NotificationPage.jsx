import React, { useEffect } from "react";
import useNotificationStore from "../store/notificationStore";
import useGroupStore from "../store/groupStore";
import { Check } from "lucide-react";

const NotificationsPage = () => {
  const { notifications, fetchNotifications, markAllAsRead } =
    useNotificationStore();
  const { fetchJoinedGroups, acceptJoinRequest } = useGroupStore();

  useEffect(() => {
    fetchNotifications();
    markAllAsRead();
  }, []);

  const handleAcceptJoin = async (notif) => {
    const userId = notif.fromUser?._id;
    const groupId = notif.groupId._id;
    acceptJoinRequest(groupId, userId);
    fetchJoinedGroups();
  };

  if (!notifications.length) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500 dark:text-gray-400 text-center">
        No notifications to show 📭
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24 bg-white dark:bg-gradient-to-br dark:from-[#111827] dark:to-[#1f2937] transition-colors">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        🔔 Notifications
      </h2>

      <div className="space-y-4 max-w-2xl mx-auto">
        {notifications.map((notif) => (
          <div
            key={notif._id}
            className="flex items-start justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-100 leading-snug">
                <span className="font-semibold text-blue-600 dark:text-blue-300">
                  {notif.fromUser?.username || "Someone"}
                </span>{" "}
                {notif.message}
              </p>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>

            {notif.type === "join-request" && (
              <button
                onClick={() => handleAcceptJoin(notif)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                <Check size={16} />
                Accept
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
