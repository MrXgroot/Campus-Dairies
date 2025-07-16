const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    // Text content
    caption: { type: String },
    category: { type: String }, // Optional (tech, farewell, etc.)

    // Media
    mediaUrl: { type: String, required: true }, // Either image or video URL
    type: {
      type: String,
      enum: ["image", "photo", "video"],
      required: true,
    },

    // Mood emoji
    mood: {
      type: String,
      enum: ["😭", "🥹", "😄", "❤️", "🔥", "👍"],
      default: "❤️",
    },

    // Author
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    verified: { type: Boolean, default: false }, // Optional badge

    // Group context
    groupId: {
      type: Schema.Types.Mixed, // Allow "public" or ObjectId
      required: true,
    },

    // Tagged friends
    taggedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // Reactions count
    reactions: {
      hearts: [{ type: Schema.Types.ObjectId, ref: "User" }],
      waves: [{ type: Schema.Types.ObjectId, ref: "User" }],
      laughs: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    reports: [
      {
        reportedBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],

    // Comments reference
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
