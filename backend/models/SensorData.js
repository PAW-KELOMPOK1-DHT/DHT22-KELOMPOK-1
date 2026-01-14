const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SensorData = sequelize.define('SensorData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sensor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sensor_id'
  },
  humidity: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  temperature: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sensor_data',
  timestamps: false
});

module.exports = SensorData;
