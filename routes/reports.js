const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { authenticateToken, isAdmin } = require("../middleware/permissionMiddleware");

// Rute laporan (hanya admin)
router.get("/daily", [authenticateToken, isAdmin], reportController.getDailyReport);

module.exports = router;
