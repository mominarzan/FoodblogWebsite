const mongoose = require("mongoose");

// Mongoose Schema Setup
const commentSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});

// Creating a model
module.exports = mongoose.model("Comment", commentSchema);
