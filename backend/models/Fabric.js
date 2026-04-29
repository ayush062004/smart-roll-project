const mongoose = require("mongoose");

const fabricSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  totalLength: {
    type: Number,
    required: true
  },
  availableLength: {
    type: Number,
    required: true
  },
  type: String,

  status: {
    type: String,
    default: "available"
  },

  qrCode: String

}, { timestamps: true });

module.exports = mongoose.model("Fabric", fabricSchema);