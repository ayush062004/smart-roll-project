const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");



// 🔐 Load env variables
dotenv.config();

// 🔌 Connect DB
connectDB();

// 🚀 Initialize app
const app = express();

// 🌐 CORS (frontend connect)
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // cookies ke liye important
  })
);

// 📦 Middlewares
app.use(express.json());
app.use(cookieParser());

// 🧪 Test route (optional)
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// 🔗 Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/fabric", require("./routes/fabricRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));



// ⚠️ Global error handler (optional but good)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong" });
});

// 🎯 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});