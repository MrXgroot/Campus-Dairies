import { Link } from "react-router-dom";
import { X } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import Lottie from "lottie-react";
import wavingHand from "../../assets/wavinghand.json";

const NotificationCard = ({ notification, onDelete, onApproveRequest }) => {
  const { _id, sender, message, post, isRead, createdAt, type, group } =
    notification;
  const [approved, setApproved] = useState(false);

  const handleApprove = () => {
    if (onApproveRequest && sender && group) {
      onApproveRequest(group._id, sender._id, _id);
      setApproved(true);
    }
  };

  // 🔵 WAVE TYPE NOTIFICATION
  if (type === "wave") {
    return (
      <div
        className={`flex justify-between items-center p-4 rounded-xl shadow-sm transition relative
          ${
            isRead
              ? "bg-white dark:bg-gray-800"
              : "bg-yellow-50 dark:bg-gray-700"
          } hover:bg-gray-100 dark:hover:bg-gray-600`}
      >
        {/* Delete button */}
        <button
          onClick={onDelete}
          className="absolute top-3 z-5 right-3 text-gray-400 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
        >
          <X size={16} />
        </button>

        {/* Left content */}
        <div className="flex items-center gap-3">
          <img
            src={sender.avatar}
            alt={sender.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              <span className="font-semibold text-gray-900 dark:text-white">
                {sender.username}
              </span>{" "}
              {message}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {moment(createdAt).fromNow()}
            </p>
          </div>
        </div>

        {/* Animation */}
        <Lottie
          animationData={wavingHand}
          loop={true}
          autoplay={true}
          className="w-16 h-16 scale-200 object-contain rounded-md"
        />
      </div>
    );
  }

  // 🔵 OTHER TYPES
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl shadow-sm relative transition 
        ${
          isRead ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900"
        } hover:bg-blue-100 dark:hover:bg-blue-800`}
    >
      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
      >
        <X size={16} />
      </button>

      {/* Avatar */}
      <img
        src={sender.avatar}
        alt={sender.username}
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-tight">
          <span className="font-semibold text-gray-900 dark:text-white">
            {sender.username}
          </span>{" "}
          {message}
        </p>

        {/* Link to post */}
        {["comment", "tag"].includes(type) && post?._id && (
          <Link
            to={`/post/${post._id}`}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1 inline-block"
          >
            View Post
          </Link>
        )}

        {/* Confirmation */}
        {type === "join-approved" && (
          <div className="mt-2 text-xs text-green-700 dark:text-green-300 font-medium bg-green-100 dark:bg-green-900 px-2 py-1 rounded-md inline-block">
            ✅ Your request to join has been approved!
          </div>
        )}

        {approved && (
          <div className="mt-2 text-xs text-green-700 dark:text-green-300 font-medium bg-green-100 dark:bg-green-900 px-2 py-1 rounded-md inline-block">
            Request approved ✔️
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {moment(createdAt).fromNow()}
        </p>
      </div>

      {/* Accept Button for join-request */}
      {type === "join-request" && !approved && (
        <button
          onClick={handleApprove}
          className="text-xs px-3 py-1 rounded-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition self-end"
        >
          Accept
        </button>
      )}
    </div>
  );
};

export default NotificationCard;
