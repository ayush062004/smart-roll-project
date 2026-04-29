const mongoose = require("mongoose");

const cutHistorySchema = new mongoose.Schema(
  {
    fabricId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fabric"
    },
    rollNumber: String,
    name: String,
    cutLength: Number,
    remainingLength: Number,

    // 🔥 IMPORTANT
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("CutHistory", cutHistorySchema);