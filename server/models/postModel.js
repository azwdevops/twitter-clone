const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = Schema(
  {
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    pinned: { type: Boolean },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweetData: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
