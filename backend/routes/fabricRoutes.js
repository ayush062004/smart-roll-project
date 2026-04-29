const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware"); // 🔥 IMPORTANT

const {
  addFabric,
  getFabrics,
  cutFabric,
  getStats,
  getFabricByQR,
  addLength,
  deleteFabric,
  getHistory,
  getCutHistory,
  getWeeklyCuts
} = require("../controllers/fabricController");

// ✅ ROUTES
router.get("/stats", getStats);
router.get("/qr/:rollNumber", getFabricByQR);

router.post("/add", addFabric);
router.get("/", getFabrics);

// 🔥 FIXED HERE
router.post("/cut", auth, cutFabric);

router.post("/add-length", addLength);
router.delete("/:id", deleteFabric);

// ✅ HISTORY
router.get("/history", getHistory);
router.get("/cut-history", getCutHistory);
router.get("/weekly", getWeeklyCuts);

module.exports = router;