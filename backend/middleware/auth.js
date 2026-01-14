const jwt = require('jsonwebtoken');
const { User, Sensor } = require('../models');

// Middleware untuk authenticate user dengan JWT
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Akses ditolak. Token tidak ditemukan.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User tidak ditemukan.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token tidak valid.' 
    });
  }
};

// Middleware untuk check role admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Akses ditolak. Admin only.' 
    });
  }
  next();
};

// Middleware untuk validate API token dari Raspberry Pi
exports.validateApiToken = async (req, res, next) => {
  try {
    const apiToken = req.header('X-API-Token');
    
    if (!apiToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'API Token tidak ditemukan.' 
      });
    }

    // Cari sensor dengan API token yang cocok
    const sensor = await Sensor.findOne({ 
      where: { 
        api_token: apiToken,
        is_active: true 
      } 
    });
    
    if (!sensor) {
      return res.status(401).json({ 
        success: false, 
        message: 'API Token tidak valid atau sensor tidak aktif.' 
      });
    }

    req.sensor = sensor;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Autentikasi gagal.' 
    });
  }
};
