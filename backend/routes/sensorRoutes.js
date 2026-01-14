const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Semua routes memerlukan authentication
router.use(authenticate);

// Get all sensors
router.get('/', sensorController.getAllSensors);

// Get sensor by ID
router.get('/:id', sensorController.getSensorById);

// Admin only routes
router.post('/', isAdmin, sensorController.createSensor);
router.put('/:id', isAdmin, sensorController.updateSensor);
router.delete('/:id', isAdmin, sensorController.deleteSensor);
router.post('/:id/regenerate-token', isAdmin, sensorController.regenerateApiToken);

module.exports = router;
