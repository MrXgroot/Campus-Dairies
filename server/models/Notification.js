const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    // Receiver of the notification
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Sender of the notification (can be null for system messages)
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // Notification type
    type: {
      type: String,
      enum: [
        "wave",
        "heart",
        "star",
        "comment",
        "tag",
        "join-request",
        "join-approved",
      ],
      required: true,
    },

    // Optional descriptive message
    message: {
      type: String,
    },

    // Optional reference to post
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },

    // Optional reference to group (for join-related events)
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },

    // Whether user has read this notification
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
