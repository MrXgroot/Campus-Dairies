const commentSchema = new mongoose.Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    }, // <- this is key
  },
  { timestamps: true }
);
