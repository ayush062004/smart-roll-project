const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  rollNumber: String,
  name: String,
  action: String,
  length: Number,
  remainingLength: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("History", historySchema);