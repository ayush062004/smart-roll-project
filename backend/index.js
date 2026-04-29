const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// 🔐 Load env
dotenv.config();

// 🔌 Connect DB
connectDB();

// 🚀 Init App
const app = express();

// 🔥 Trust proxy (Render)
app.set("trust proxy", 1);

// ==============================
// MIDDLEWARES
// ==============================

// JSON
app.use(express.json());

// 🌐 CORS
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://smart-roll-project.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ==============================
// ROUTES
// ==============================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/fabric", require("./routes/fabricRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ==============================
// ERROR HANDLER
// ==============================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    msg: "Something went wrong ❌"
  });
});

// ==============================
// SERVER START
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});