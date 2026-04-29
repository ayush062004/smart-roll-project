const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email & Password required ❌" });
    }

    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials ❌" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000
});

    res.status(200).json({
      msg: "Login successful ✅"
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error ❌" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });

  res.json({ msg: "Logout successful ✅" });
};