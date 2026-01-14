const { SensorData, Sensor } = require('../models');

// Terima data dari Raspberry Pi (HTTP POST)
exports.receiveSensorData = async (req, res) => {
  try {
    const { humidity, temperature } = req.body;

    // Validasi input
    if (humidity === undefined || humidity === null) {
      return res.status(400).json({ 
        success: false, 
        message: 'Data humidity harus diisi.' 
      });
    }

    // Simpan data ke database
    const sensorData = await SensorData.create({
      sensor_id: req.sensor.id,
      humidity: parseFloat(humidity),
      temperature: temperature ? parseFloat(temperature) : null
    });

    res.status(201).json({
      success: true,
      message: 'Data sensor berhasil disimpan.',
      data: sensorData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal menyimpan data sensor.', 
      error: error.message 
    });
  }
};

// Get data sensor history (untuk admin/user)
exports.getSensorDataHistory = async (req, res) => {
  try {
    const { sensorId, startDate, endDate, limit = 100 } = req.query;

    const where = {};
    
    if (sensorId) {
      where.sensor_id = sensorId;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate);
    }

    const data = await SensorData.findAll({
      where,
      include: [{
        model: Sensor,
        as: 'sensor',
        attributes: ['id', 'name', 'location', 'sensor_type']
      }],
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mendapatkan data history.', 
      error: error.message 
    });
  }
};

// Get data sensor terbaru
exports.getLatestSensorData = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const latestData = await SensorData.findOne({
      where: { sensor_id: sensorId },
      include: [{
        model: Sensor,
        as: 'sensor',
        attributes: ['id', 'name', 'location', 'sensor_type']
      }],
      order: [['timestamp', 'DESC']]
    });

    if (!latestData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Data tidak ditemukan.' 
      });
    }

    res.json({
      success: true,
      data: latestData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mendapatkan data terbaru.', 
      error: error.message 
    });
  }
};

// Delete sensor data (admin only)
exports.deleteSensorData = async (req, res) => {
  try {
    const { id } = req.params;

    const sensorData = await SensorData.findByPk(id);

    if (!sensorData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Data tidak ditemukan.' 
      });
    }

    await sensorData.destroy();

    res.json({
      success: true,
      message: 'Data berhasil dihapus.'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal menghapus data.', 
      error: error.message 
    });
  }
};
