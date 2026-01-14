const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field harus diisi.' 
      });
    }

    // Check apakah user sudah ada
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username atau email sudah digunakan.' 
      });
    }

    // Buat user baru
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil.',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Registrasi gagal.', 
      error: error.message 
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email dan password harus diisi.' 
      });
    }

    // Cari user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah.' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah.' 
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login berhasil.',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Login gagal.', 
      error: error.message 
    });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          role: req.user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mendapatkan data user.', 
      error: error.message 
    });
  }
};
