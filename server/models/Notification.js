const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    // Receiver of the notification
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Sender of the notification (can be null for system messages)
    sender: {
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
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },

    // Optional reference to group (for join-related events)
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },

    // Whether the notification has been read
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
