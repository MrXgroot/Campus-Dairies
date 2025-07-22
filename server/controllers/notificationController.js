const Notification = require("../models/Notification");
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.user.id })
      .sort({ createdAt: -1 })
      .populate("sender", "username avatar")
      .populate("group", "name")
      .populate("post", "_id");

    res.status(200).json({ notifications });
  } catch (err) {
    console.error("❌ Failed to fetch notifications:", err.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findOneAndDelete({
      _id: req.params.id,
      receiver: req.user.id,
    });

    if (!notif) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res
      .status(200)
      .json({ message: "Notification deleted", deletedId: notif._id });
  } catch (err) {
    console.error("❌ Failed to delete notification:", err.message);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ receiver: req.user.id });

    res.status(200).json({ message: "All notifications deleted" });
  } catch (err) {
    console.error("❌ Failed to clear notifications:", err.message);
    res.status(500).json({ error: "Failed to delete all notifications" });
  }
};

exports.createNotification = async ({
  senderId,
  receiverId,
  type,
  message = "",
  postId = null,
  groupId = null,
  io = null,
}) => {
  if (receiverId.toString() === senderId.toString()) return null;

  try {
    const notification = new Notification({
      sender: senderId,
      receiver: receiverId,
      type,
      message,
      post: postId,
      group: groupId,
    });

    const savedNotification = await notification.save();

    await savedNotification.populate([
      { path: "sender", select: "username avatar" },
      { path: "post", select: "_id" },
      { path: "group", select: "name" },
    ]);

    // Real-time emit (if io is available and user is online)
    if (io) {
      io.to(receiverId.toString()).emit("new-notification", savedNotification);
    }

    return savedNotification;
  } catch (err) {
    console.error("❌ Failed to create notification:", err.message);
    throw err;
  }
};
