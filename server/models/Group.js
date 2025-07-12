const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "MCA", "MSc", "Public Wall"
    isPrivate: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },

    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    moderators: [{ type: Schema.Types.ObjectId, ref: "User" }],

    stats: {
      totalMembers: { type: Number, default: 0 },
      totalPosts: { type: Number, default: 0 },
      totalVideos: { type: Number, default: 0 },
    },

    onlineMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
