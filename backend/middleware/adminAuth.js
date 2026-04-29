const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({ msg: "No admin token ❌" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ msg: "Not admin ❌" });
    }

    req.admin = decoded;
    next();

  } catch (err) {
    res.status(401).json({ msg: "Invalid token ❌" });
  }
};