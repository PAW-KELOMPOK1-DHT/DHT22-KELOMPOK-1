const { SensorData, Sensor } = require('../models');
const { Op, fn, col } = require('sequelize');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total sensors
    const totalSensors = await Sensor.count();
    const activeSensors = await Sensor.count({ where: { is_active: true } });

    // Total data logs
    const totalLogs = await SensorData.count();

    // Latest readings dari semua sensor
    const sensors = await Sensor.findAll({ where: { is_active: true } });
    const latestReadings = [];

    for (const sensor of sensors) {
      const latestData = await SensorData.findOne({
        where: { sensor_id: sensor.id },
        order: [['timestamp', 'DESC']]
      });
      
      if (latestData) {
        latestReadings.push({
          sensor: {
            id: sensor.id,
            name: sensor.name,
            location: sensor.location
          },
          humidity: latestData.humidity,
          temperature: latestData.temperature,
          timestamp: latestData.timestamp
        });
      }
    }

    res.json({
      success: true,
      data: {
        statistics: {
          totalSensors,
          activeSensors,
          totalLogs
        },
        latestReadings
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mendapatkan statistik dashboard.', 
      error: error.message 
    });
  }
};

// Get chart data untuk grafik kelembapan
exports.getChartData = async (req, res) => {
  try {
    const { sensorId, period = '24h' } = req.query;

    // Tentukan time range berdasarkan period
    const now = new Date();
    let startDate;

    switch (period) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Build where clause
    const where = {
      timestamp: { [Op.gte]: startDate }
    };

    if (sensorId) {
      where.sensor_id = sensorId;
    }

    // Get data
    const data = await SensorData.findAll({
      where,
      include: [{
        model: Sensor,
        as: 'sensor',
        attributes: ['id', 'name', 'location']
      }],
      order: [['timestamp', 'ASC']],
      limit: 1000
    });

    // Format data untuk chart
    const chartData = data.map(item => ({
      timestamp: item.timestamp,
      humidity: parseFloat(item.humidity),
      temperature: item.temperature ? parseFloat(item.temperature) : null,
      sensor: item.sensor ? {
        id: item.sensor.id,
        name: item.sensor.name,
        location: item.sensor.location
      } : null
    }));

    res.json({
      success: true,
      period,
      count: chartData.length,
      data: chartData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mendapatkan data chart.', 
      error: error.message 
    });
  }
};

// Get aggregated data (rata-rata, min, max per sensor)
exports.getAggregatedData = async (req, res) => {
  try {
    const { sensorId, startDate, endDate } = req.query;

    // Build where clause
    const where = {};
    
    if (sensorId) {
      where.sensor_id = sensorId;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate);
    }

    // Get aggregated data
    const aggregatedData = await SensorData.findAll({
      attributes: [
        'sensor_id',
        [fn('AVG', col('humidity')), 'avg_humidity'],
        [fn('MIN', col('humidity')), 'min_humidity'],
        [fn('MAX', col('humidity')), 'max_humidity'],
        [fn('AVG', col('temperature')), 'avg_temperature'],
        [fn('MIN', col('temperature')), 'min_temperature'],
        [fn('MAX', col('temperature')), 'max_temperature'],
        [fn('COUNT', col('id')), 'data_count'],
        [fn('MAX', col('timestamp')), 'latest_timestamp']
      ],
      where,
      include: [{
        model: Sensor,
        as: 'sensor',
        attributes: ['id', 'name', 'location', 'sensor_type']
      }],
      group: ['sensor_id'],
      raw: true
    });

    // Format hasil
    const formattedData = aggregatedData.map(item => ({
      sensor: {
        id: item.sensor_id,
        name: item['sensor.name'],
        location: item['sensor.location']
      },
      humidity: {
        avg: item.avg_humidity ? Math.round(parseFloat(item.avg_humidity) * 100) / 100 : null,
        min: item.min_humidity ? parseFloat(item.min_humidity) : null,
        max: item.max_humidity ? parseFloat(item.max_humidity) : null
      },
      temperature: {
        avg: item.avg_temperature ? Math.round(parseFloat(item.avg_temperature) * 100) / 100 : null,
        min: item.min_temperature ? parseFloat(item.min_temperature) : null,
        max: item.max_temperature ? parseFloat(item.max_temperature) : null
      },
      dataCount: parseInt(item.data_count),
      latestTimestamp: item.latest_timestamp
    }));

    res.json({
      success: true,
      count: formattedData.length,
      data: formattedData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mendapatkan aggregated data.', 
      error: error.message 
    });
  }
};
