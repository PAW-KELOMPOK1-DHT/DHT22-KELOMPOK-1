const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../controllers/authController"); // pakai secret dari controller

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak disediakan." });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid atau kedaluwarsa." });
    }
    req.user = userPayload;
    next();
  });
};

// Middleware untuk cek admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Akses ditolak. Hanya untuk admin." });
  }
};
