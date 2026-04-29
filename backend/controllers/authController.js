const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // 🔍 Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email & Password required ❌" });
    }

    email = email.toLowerCase();

    // 🔍 Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found ❌" });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials ❌" });
    }

    // 🔑 Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🍪 Cookie set
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 🔥 production me true
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ✅ Response (NO PASSWORD)
    res.status(200).json({
      msg: "Login successful ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error ❌" });
  }
};

// ================= LOGOUT =================
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logout successful ✅" });
};