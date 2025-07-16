import React, { useEffect } from "react";
import useNotificationStore from "../store/notificationStore";
import useGroupStore from "../store/groupStore";
import { Check } from "lucide-react";
import api from "../utils/api";

const NotificationsPage = () => {
  const { notifications, fetchNotifications, markAllAsRead } =
    useNotificationStore();

  const { fetchJoinedGroups, acceptJoinRequest } = useGroupStore();

  useEffect(() => {
    fetchNotifications();
    markAllAsRead();
  }, []);

  const handleAcceptJoin = async (notif) => {
    console.log(notif);
    const userId = notif.fromUser?._id;
    const groupId = notif.groupId._id;
    console.log(userId, groupId);
    acceptJoinRequest(groupId, userId);
    fetchJoinedGroups();
  };

  if (!notifications.length) {
    return (
      <div className="text-center mt-10 text-gray-400">No notifications</div>
    );
  }

  return (
    <div className="p-4 pb-20 bg-gradient-to-br from-[#111827] to-[#1f2937] min-h-screen text-white">
      <h2 className="text-xl font-semibold mb-4 text-center text-white">
        🔔 Notifications
      </h2>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif._id}
            className="flex items-center justify-between p-3 bg-[#1f2937] rounded-xl shadow-md border border-gray-700"
          >
            <div>
              <p className="text-sm">
                <span className="font-medium text-blue-300">
                  {notif.fromUser?.username || "Someone"}
                </span>{" "}
                {notif.message}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>

            {notif.type === "join-request" && (
              <button
                onClick={() => handleAcceptJoin(notif)}
                className="ml-3 bg-green-500 hover:bg-green-600 text-sm text-white px-3 py-1 rounded-lg flex items-center gap-1"
              >
                <Check size={16} /> Accept
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
