// models/MessageWall.js
const mongoose = require("mongoose");

const messageWallSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    reports: [
      {
        reportedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: {
          type: String,
          enum: ["spam", "inappropriate", "harassment", "other"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
messageWallSchema.index({ createdAt: -1 });
messageWallSchema.index({ author: 1 });
messageWallSchema.index({ isDeleted: 1 });

// Virtual for populated author info
messageWallSchema.virtual("authorInfo", {
  ref: "User",
  localField: "author",
  foreignField: "_id",
  justOne: true,
});

// Don't include deleted messages in normal queries
messageWallSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model("MessageWall", messageWallSchema);
