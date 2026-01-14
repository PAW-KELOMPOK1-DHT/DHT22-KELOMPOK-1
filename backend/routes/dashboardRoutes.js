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

// Aggregated data (avg, min, max)
router.get('/aggregated', dashboardController.getAggregatedData);

module.exports = router;
