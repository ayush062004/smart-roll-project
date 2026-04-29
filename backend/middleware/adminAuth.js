const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "No admin token ❌"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        msg: "Not admin ❌"
      });
    }

    req.admin = decoded;

    next();

  } catch (err) {
    return res.status(401).json({
      msg: "Invalid token ❌"
    });
  }
};