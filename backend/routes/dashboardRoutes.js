const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

// Semua routes memerlukan authentication
router.use(authenticate);

// Dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

// Chart data untuk grafik
router.get('/chart', dashboardController.getChartData);

module.exports = router;
