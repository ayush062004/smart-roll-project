const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");
const {
  adminLogin,
  createUser,
  getCuts,
  getDashboardStats,
} = require("../controllers/adminController");

// 🔓 LOGIN
router.post("/login", adminLogin);

// 🔒 PROTECTED ROUTES
router.post("/create-user", adminAuth, createUser);
router.get("/cuts", adminAuth, getCuts);
router.get("/dashboard-stats", adminAuth, getDashboardStats);
const {
  getAllUsers,
  deleteUser
} = require("../controllers/adminController");

// 👥 USERS
router.get("/users", adminAuth, getAllUsers);
router.delete("/user/:id", adminAuth, deleteUser);


const {
  getInventory,
  addFabric,
  updateFabric,
  deleteFabric,
} = require("../controllers/adminController");



// 🔥 INVENTORY ROUTES
router.get("/inventory", adminAuth, getInventory);
router.post("/inventory", adminAuth, addFabric);
router.put("/inventory/:id", adminAuth, updateFabric);
router.delete("/inventory/:id", adminAuth, deleteFabric);

module.exports = router;