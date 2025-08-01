const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._]+$/,
    },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
    avatarPublicId: { type: String, default: "" },
    quote: { type: String, default: "" },

    password: { type: String, required: true }, // hashed

    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    taggedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],

    waves: [{ type: Schema.Types.ObjectId, ref: "User" }],
    hearts: [{ type: Schema.Types.ObjectId, ref: "User" }],

    isOnline: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ name: "text", username: "text" });

module.exports = mongoose.model("User", userSchema);
