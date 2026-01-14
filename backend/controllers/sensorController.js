const { Sensor, User } = require('../models');
const crypto = require('crypto');

// Generate API Token
const generateApiToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Get all sensors
exports.getAllSensors = async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'email']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: sensors.length,
      data: sensors
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mendapatkan data sensor.', 
      error: error.message 
    });
  }
};

// Get sensor by ID
exports.getSensorById = async (req, res) => {
  try {
    const { id } = req.params;

    const sensor = await Sensor.findByPk(id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'email']
      }]
    });

    if (!sensor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sensor tidak ditemukan.' 
      });
    }

    res.json({
      success: true,
      data: sensor
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mendapatkan data sensor.', 
      error: error.message 
    });
  }
};

// Create new sensor (admin only)
exports.createSensor = async (req, res) => {
  try {
    const { name, location, sensorType, description } = req.body;

    // Validasi input
    if (!name || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nama dan lokasi sensor harus diisi.' 
      });
    }

    // Generate API token
    const apiToken = generateApiToken();

    const sensor = await Sensor.create({
      name,
      location,
      sensor_type: sensorType || 'DHT22',
      description: description || '',
      api_token: apiToken,
      created_by: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Sensor berhasil ditambahkan.',
      data: sensor
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal menambahkan sensor.', 
      error: error.message 
    });
  }
};

// Update sensor (admin only)
exports.updateSensor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, sensorType, description, isActive } = req.body;

    const sensor = await Sensor.findByPk(id);

    if (!sensor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sensor tidak ditemukan.' 
      });
    }

    // Update sensor
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (sensorType !== undefined) updateData.sensor_type = sensorType;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.is_active = isActive;
    updateData.updated_at = new Date();

    await sensor.update(updateData);

    res.json({
      success: true,
      message: 'Sensor berhasil diupdate.',
      data: sensor
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mengupdate sensor.', 
      error: error.message 
    });
  }
};

// Delete sensor (admin only)
exports.deleteSensor = async (req, res) => {
  try {
    const { id } = req.params;

    const sensor = await Sensor.findByPk(id);

    if (!sensor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sensor tidak ditemukan.' 
      });
    }

    await sensor.destroy();

    res.json({
      success: true,
      message: 'Sensor berhasil dihapus.'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal menghapus sensor.', 
      error: error.message 
    });
  }
};

// Regenerate API Token (admin only)
exports.regenerateApiToken = async (req, res) => {
  try {
    const { id } = req.params;

    const sensor = await Sensor.findByPk(id);

    if (!sensor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sensor tidak ditemukan.' 
      });
    }

    const apiToken = generateApiToken();
    await sensor.update({ api_token: apiToken });

    res.json({
      success: true,
      message: 'API Token berhasil di-generate ulang.',
      data: {
        apiToken
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal regenerate API Token.', 
      error: error.message 
    });
  }
};
