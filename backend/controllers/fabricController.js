const Fabric = require("../models/Fabric");
const CutHistory = require("../models/CutHistory");
const QRCode = require("qrcode");
const History = require("../models/History");

// ✅ GET BY QR
exports.getFabricByQR = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const fabric = await Fabric.findOne({ rollNumber });

    if (!fabric) {
      return res.status(404).json({ message: "Fabric not found" });
    }

    res.json(fabric);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ STATS
exports.getStats = async (req, res) => {
  try {
    const total = await Fabric.countDocuments();
    const available = await Fabric.countDocuments({ status: "available" });
    const used = await Fabric.countDocuments({ status: "used" });
    const damaged = await Fabric.countDocuments({ status: "damaged" });

    res.json({ total, available, used, damaged });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ ADD FABRIC
exports.addFabric = async (req, res) => {
  try {
    const { name, totalLength, type } = req.body;

    const rollNumber = "ROLL-" + Date.now();

    const qrData = JSON.stringify({ rollNumber, name, totalLength, type });
    const qrCode = await QRCode.toDataURL(qrData);

    const fabric = await Fabric.create({
      rollNumber,
      name,
      totalLength,
      availableLength: totalLength,
      type,
      qrCode,
      status: "available"
    });

    res.json({ message: "Fabric added", fabric });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET ALL
exports.getFabrics = async (req, res) => {
  try {
    const fabrics = await Fabric.find();
    res.json(fabrics);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ CUT FABRIC
exports.cutFabric = async (req, res) => {
  try {
    const { id, cutLength } = req.body;

    const fabric = await Fabric.findById(id);
    if (!fabric) return res.status(404).json({ msg: "Not found" });

    if (cutLength > fabric.availableLength) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    fabric.availableLength -= cutLength;

    if (fabric.availableLength <= 0) {
      fabric.availableLength = 0;
      fabric.status = "used";
    }

    await fabric.save();

    // CUT HISTORY
    await CutHistory.create({
  fabricId: fabric._id,
  rollNumber: fabric.rollNumber,
  name: fabric.name,
  cutLength: cutLength, // ✅ FIXED
  remainingLength: fabric.availableLength,
  userId: req.user.id // 🔥 IMPORTANT
});

    // GLOBAL HISTORY
    await History.create({
      rollNumber: fabric.rollNumber,
      name: fabric.name,
      action: "CUT",
      length: cutLength,
      remainingLength: fabric.availableLength
    });

    res.json(fabric);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.addLength = async (req, res) => {
  try {
    let { id, length } = req.body;

    console.log("Incoming:", id, length);

    // 🔥 FORCE NUMBER
    length = Number(length);

    // ❌ INVALID INPUT
    if (!id || isNaN(length) || length <= 0) {
      return res.status(400).json({
        message: "Invalid length ❌"
      });
    }

    const fabric = await Fabric.findById(id);

    if (!fabric) {
      return res.status(404).json({
        message: "Fabric not found ❌"
      });
    }

    // 🔥 SAFETY: old values bhi number bana
    const currentTotal = Number(fabric.totalLength) || 0;
    const currentAvailable = Number(fabric.availableLength) || 0;

    // ❌ agar DB me NaN hai to reset
    if (isNaN(currentTotal) || isNaN(currentAvailable)) {
      return res.status(500).json({
        message: "Corrupted data in DB ❌"
      });
    }

    // ✅ SAFE UPDATE
    fabric.totalLength = currentTotal + length;
    fabric.availableLength = currentAvailable + length;

    await fabric.save();

    // 🔥 HISTORY
    await History.create({
      rollNumber: fabric.rollNumber,
      name: fabric.name,
      action: "ADD",
      length,
      remainingLength: fabric.availableLength
      
    });

    res.json({
      message: "Length added successfully ✅",
      fabric
    });

  } catch (err) {
    console.error("ADD LENGTH ERROR:", err);
    res.status(500).json({
      message: "Server error ❌"
    });
  }
};

// ✅ DELETE
exports.deleteFabric = async (req, res) => {
  try {
    const { id } = req.params;

    const fabric = await Fabric.findById(id);

    if (!fabric) {
      return res.status(404).json({ msg: "Fabric not found ❌" });
    }

    // 🔥 SAVE HISTORY BEFORE DELETE
    await History.create({
      rollNumber: fabric.rollNumber,
      name: fabric.name,
      action: "DELETE",
      length: fabric.availableLength, // jo remaining tha
      remainingLength: 0
    });

    // 🗑 DELETE
    await Fabric.findByIdAndDelete(id);

    res.json({ msg: "Fabric deleted & history saved 🗑" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ✅ HISTORY
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

// ✅ CUT HISTORY
exports.getCutHistory = async (req, res) => {
  try {
    const history = await CutHistory.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ WEEKLY CUT DATA (FOR DASHBOARD)
exports.getWeeklyCuts = async (req, res) => {
  try {
    const data = await CutHistory.find();

    const result = [
      { name: "Sun", cuts: 0 },
      { name: "Mon", cuts: 0 },
      { name: "Tue", cuts: 0 },
      { name: "Wed", cuts: 0 },
      { name: "Thu", cuts: 0 },
      { name: "Fri", cuts: 0 },
      { name: "Sat", cuts: 0 }
    ];

    data.forEach(item => {
      const day = new Date(item.createdAt).getDay();
      result[day].cuts += 1; // ✅ COUNT INCREASE
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};