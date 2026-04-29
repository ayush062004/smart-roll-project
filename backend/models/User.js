const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,        // 🔥 unique email
      lowercase: true,     // 🔥 case insensitive
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
  },
  { timestamps: true } // 🔥 createdAt, updatedAt auto add
);

// 🔥 Important: index ensure karne ke liye
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);