import { useEffect, useState, useCallback, useMemo } from "react";
import useNotificationStore from "../store/notificationStore";
import useGroupStore from "../store/groupStore";
import useSocketMessageStore from "../store/socketMessageStore";
import NotificationCard from "../components/notification/NotificationCard";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NotificationPage = () => {
  const {
    notifications,
    loading,
    fetchNotifications,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationStore();

  const { acceptJoinRequest } = useGroupStore();
  const { markAsRead } = useSocketMessageStore();
  const [hasMounted, setHasMounted] = useState(false);

  // Only set hasMounted once to avoid replaying animations
  useEffect(() => setHasMounted(true), []);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    markAsRead();
  }, [fetchNotifications, markAsRead]);

  const handleAcceptJoinRequest = useCallback(
    (groupId, userId, notificationId) => {
      acceptJoinRequest(groupId, userId, notificationId);
    },
    [acceptJoinRequest]
  );

  const handleDeleteNotification = useCallback(
    (id) => deleteNotification(id),
    [deleteNotification]
  );

  const renderedNotifications = useMemo(
    () =>
      notifications.map((notification) => (
        <motion.div
          key={notification._id}
          initial={hasMounted ? false : { opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          whileDrag={{ scale: 0.97 }}
          onDragEnd={(e, info) => {
            if (info.offset.x < -200) {
              handleDeleteNotification(notification._id); // swipe left to delete
            }
          }}
          transition={{ duration: 0.3 }}
          layout
        >
          <NotificationCard
            notification={notification}
            onApproveRequest={handleAcceptJoinRequest}
            onDelete={() => handleDeleteNotification(notification._id)}
          />
        </motion.div>
      )),
    [
      notifications,
      handleDeleteNotification,
      handleAcceptJoinRequest,
      hasMounted,
    ]
  );

  return (
    <div className="max-w-xl mx-auto py-10 px-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold dark:text-gray-100">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={deleteAllNotifications}
            className="text-sm text-red-600 hover:underline "
          >
            Delete All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-blue-500 mr-2" />
          Loading...
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {renderedNotifications}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
