const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // receiver
    type: {
      type: String,
      enum: ["wave", "heart", "star", "comment", "tag"],
      required: true,
    },
    message: { type: String, required: true },
    fromUser: { type: Schema.Types.ObjectId, ref: "User" },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
