const { Presensi, User } = require('../models'); 
const multer = require('multer');
const path = require('path');

// ==========================
// Setup Multer untuk Upload Foto
// ==========================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // pastikan folder 'uploads/' ada
    },
    filename: (req, file, cb) => {
        // userId-timestamp.ext
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`); 
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

// 🔑 PERBAIKAN: Mengganti .single('image') menjadi .single('buktiFoto') 
// agar sesuai dengan nama field yang dikirim dari frontend (formData.append('buktiFoto', ...))
exports.upload = multer({ storage, fileFilter }).single('buktiFoto');

// ==========================
// CHECK-IN (latitude & longitude opsional)
// ==========================
exports.checkIn = async (req, res) => {
    try {
        // Asumsi req.user.id sudah ada dari middleware authenticateToken
        const userId = req.user.id; 
        const { latitude, longitude } = req.body;
        // req.file.path akan berisi path file yang diupload
        const buktiFoto = req.file ? req.file.path : null; 

        const today = new Date().toISOString().split('T')[0];

        // Cek apakah sudah check-in hari ini
        const existingPresensi = await Presensi.findOne({
            where: { userId, tanggal: today }
        });

        if (existingPresensi && existingPresensi.check_in) {
            return res.status(400).json({ message: "Anda sudah check-in hari ini." });
        }

        // Simpan data check-in
        const newPresensi = await Presensi.create({
            userId,
            tanggal: today,
            check_in: new Date(),
            in_latitude: latitude || null,
            in_longitude: longitude || null,
            buktiFoto // Simpan path foto
        });

        res.status(200).json({
            message: "Check-in berhasil",
            presensi: newPresensi
        });

    } catch (error) {
        console.error("CheckIn error:", error);
        // Tambahkan penanganan spesifik untuk Multer error yang mungkin terlewat di middleware
        if (error instanceof multer.MulterError) {
             return res.status(400).json({ message: `Gagal upload file: ${error.message}` });
        }
        res.status(500).json({
            message: "Gagal memproses check-in.",
            error: error.message
        });
    }
};

// ==========================
// CHECK-OUT (latitude & longitude wajib)
// ==========================
exports.checkOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const { latitude, longitude } = req.body;

        if (latitude == null || longitude == null) {
            return res.status(400).json({ message: "Latitude dan Longitude wajib diisi" });
        }

        const today = new Date().toISOString().split('T')[0];
        const presensi = await Presensi.findOne({ where: { userId, tanggal: today } });

        if (!presensi || !presensi.check_in) {
            return res.status(400).json({ message: "Belum melakukan check-in hari ini." });
        }

        if (presensi.check_out) {
            return res.status(400).json({ message: "Anda sudah check-out hari ini." });
        }

        presensi.check_out = new Date();
        presensi.out_latitude = latitude;
        presensi.out_longitude = longitude;

        await presensi.save();

        res.status(200).json({
            message: "Check-out berhasil",
            presensi
        });

    } catch (error) {
        console.error("CheckOut error:", error);
        res.status(500).json({
            message: "Gagal memproses check-out.",
            error: error.message
        });
    }
};

// ==========================
// Dummy update & delete
// ==========================
exports.updatePresensi = async (req, res) => {
    res.json({ message: "Update presensi dummy berhasil" });
};

exports.deletePresensi = async (req, res) => {
    res.json({ message: "Hapus presensi dummy berhasil" });
};