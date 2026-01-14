const { User } = require('../models');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mendapatkan data user.', 
      error: error.message 
    });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan.' 
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mendapatkan data user.', 
      error: error.message 
    });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan.' 
      });
    }

    // Update user
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    await user.update(updateData);

    res.json({
      success: true,
      message: 'User berhasil diupdate.',
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mengupdate user.', 
      error: error.message 
    });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Anda tidak bisa menghapus akun sendiri.' 
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan.' 
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User berhasil dihapus.'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal menghapus user.', 
      error: error.message 
    });
  }
};
