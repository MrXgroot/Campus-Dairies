const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    groupImage: {
      type: String, // Cloudinary URL or fallback image
      default: "https://cdn-icons-png.flaticon.com/512/295/295128.png",
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    joinRequests: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        requestedAt: { type: Date, default: Date.now },
      },
    ],
    stats: {
      totalMembers: { type: Number, default: 0 },
      totalPosts: { type: Number, default: 0 },
      totalVideos: { type: Number, default: 0 },
    },

    onlineMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
