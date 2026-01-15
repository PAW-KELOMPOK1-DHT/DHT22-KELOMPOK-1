const User = require('./User');
const Sensor = require('./Sensor');
const SensorData = require('./SensorData');

// Define associations
User.hasMany(Sensor, {
  foreignKey: 'created_by',
  as: 'sensors'
});

Sensor.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator'
});

Sensor.hasMany(SensorData, {
  foreignKey: 'sensor_id',
  as: 'sensorData',
  onDelete: 'CASCADE'
});

SensorData.belongsTo(Sensor, {
  foreignKey: 'sensor_id',
  as: 'sensor'
});

module.exports = {
  User,
  Sensor,
  SensorData
};
