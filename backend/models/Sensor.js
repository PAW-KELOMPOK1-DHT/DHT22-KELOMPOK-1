const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sensor = sequelize.define('Sensor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  api_token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    field: 'api_token'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  sensor_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'DHT22',
    field: 'sensor_type'
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'sensors',
  timestamps: false
});

module.exports = Sensor;
