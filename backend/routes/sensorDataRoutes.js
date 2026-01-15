const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorDataController');
const { authenticate, isAdmin, validateApiToken } = require('../middleware/auth');

// Endpoint untuk Raspberry Pi (dengan API Token validation)
router.post('/', validateApiToken, sensorDataController.receiveSensorData);

// Protected routes (dengan JWT authentication)
router.get('/', authenticate, sensorDataController.getSensorDataHistory);
router.get('/latest/:sensorId', authenticate, sensorDataController.getLatestSensorData);
router.delete('/:id', authenticate, isAdmin, sensorDataController.deleteSensorData);

module.exports = router;
