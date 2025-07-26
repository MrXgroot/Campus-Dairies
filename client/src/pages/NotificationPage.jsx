import { useEffect } from "react";
import useNotificationStore from "../store/notificationStore";
import NotificationCard from "../components/notification/NotificationCard";
import { Loader2, Trash2 } from "lucide-react";
import useGroupStore from "../store/groupStore";
const NotificationPage = () => {
  const {
    notifications,
    loading,
    fetchNotifications,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationStore();
  const { acceptJoinRequest } = useGroupStore();
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleAcceptJoinRequest = (groupId, userId, notificationId) => {
    console.log(groupId, userId, notificationId);
    acceptJoinRequest(groupId, userId, notificationId);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={deleteAllNotifications}
            className="text-sm text-red-600 hover:underline"
          >
            Delete All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onApproveRequest={handleAcceptJoinRequest}
              onDelete={() => deleteNotification(notification._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
