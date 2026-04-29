const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Fabric = require("../models/Fabric");
const CutHistory = require("../models/CutHistory");

// ✅ ADMIN LOGIN
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(400).json({ msg: "Admin not found ❌" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password ❌" });

    // 🔥 TOKEN (role add kiya)
    const token = jwt.sign(
      { _id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔥 COOKIE (IMPORTANT)
    res.cookie("adminToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({
      msg: "Admin login success ✅",
      user: admin,
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
    });

    res.json({ msg: "User created ✅", user });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ CUT HISTORY
exports.getCuts = async (req, res) => {
  try {
    const data = await CutHistory.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const fabrics = await Fabric.find();
    const cuts = await CutHistory.find();

    // 📦 Total Rolls
    const totalRolls = fabrics.length;

    // 🔥 UNIQUE USED ROLLS
    const usedRollSet = new Set(
      cuts.map((c) => c.rollNumber)
    );

    const usedRolls = usedRollSet.size;

    // ✅ Available Rolls
    const availableRolls = totalRolls - usedRolls;

    res.json({
      totalRolls,
      usedRolls,
      availableRolls,
      damaged: 0,
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.json({ msg: "User deleted ✅" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ GET ALL FABRICS (Inventory)
exports.getInventory = async (req, res) => {
  try {
    const fabrics = await Fabric.find().sort({ createdAt: -1 });
    res.json(fabrics);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ ADD FABRIC
exports.addFabric = async (req, res) => {
  try {
    const { rollNumber, name, totalLength, type } = req.body;

    const fabric = await Fabric.create({
      rollNumber,
      name,
      totalLength,
      availableLength: totalLength, // 🔥 initially same
      type,
      status: getStatus(totalLength),
    });

    res.json({ msg: "Fabric added ✅", fabric });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ UPDATE FABRIC
exports.updateFabric = async (req, res) => {
  try {
    const { id } = req.params;

    const fabric = await Fabric.findById(id);
    if (!fabric) {
      return res.status(404).json({ msg: "Fabric not found ❌" });
    }

    // 🔥 SAFE UPDATE
    if (req.body.availableLength !== undefined) {
      const val = Number(req.body.availableLength);

      if (isNaN(val)) {
        return res.status(400).json({ msg: "Invalid length ❌" });
      }

      fabric.availableLength = val;
    }

    // 🔥 STATUS UPDATE
    fabric.status =
      fabric.availableLength <= 0
        ? "out"
        : fabric.availableLength < 1000
        ? "low"
        : "available";

    await fabric.save();

    res.json({ msg: "Updated ✅", fabric });

  } catch (err) {
    console.log("🔥 BACKEND ERROR 👉", err);
    res.status(500).json({ msg: err.message });
  }
};
// ✅ DELETE FABRIC
exports.deleteFabric = async (req, res) => {
  try {
    const { id } = req.params;

    await Fabric.findByIdAndDelete(id);

    res.json({ msg: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};