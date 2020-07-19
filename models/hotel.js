const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  name: String,
  price: String,
  image: String,
  description: String,
  address: String,
});

module.exports = mongoose.model("Hotel", hotelSchema);
