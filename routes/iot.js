const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');

router.post('/ping', iotController.testConnection);
router.post('/data', iotController.receiveSensorData);
router.get('/history', iotController.getSensorHistory);

// Endpoint penerima data sensor
// URL: http://localhost:3001/api/iot/data

module.exports = router;


