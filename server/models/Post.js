const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    caption: { type: String },
    photo: { type: String },
    video: { type: String },
    mood: {
      type: String,
      enum: ["😭", "🥹", "😄", "❤️", "🔥", "👍"],
      default: "❤️",
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    taggedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    reactions: {
      heart: { type: Number, default: 0 },
      wave: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
    },

    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
