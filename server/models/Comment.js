// models/Comment.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    replyingTo: { type: String }, // optional @username
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const commentSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: { type: String, required: true },

    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],

    replies: [replySchema],
  },
  { timestamps: true }
);
commentSchema.virtual("replyCount").get(function () {
  return this.replies.length;
});

// 👇 Ensure virtuals are included when using toObject() or toJSON()
commentSchema.set("toObject", { virtuals: true });
commentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Comment", commentSchema);
