const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const presensiController = require("../controllers/presensiController");

// Middleware autentikasi JWT
const { authenticateToken } = require("../middleware/permissionMiddleware");

// ============================
// Validasi untuk UPDATE Presensi
// ============================
const updatePresensiValidation = [
    body("checkIn")
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601()
        .withMessage("Format waktu checkIn harus berupa tanggal/waktu yang valid (ISO8601)."),
    body("checkOut")
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601()
        .withMessage("Format waktu checkOut harus berupa tanggal/waktu yang valid (ISO8601)."),
];

// ============================
// Semua rute di bawah wajib login (JWT)
// ============================
router.use(authenticateToken); // Semua route berikut membutuhkan token valid

// --- Rute Presensi ---
// Check-In (dengan upload foto)
router.post(
    "/checkin",
    presensiController.upload, // multer sudah .single('buktiFoto') di controller
    presensiController.checkIn
);

// Check-Out
router.post("/checkout", presensiController.checkOut);

// Update Presensi
router.put("/:id", updatePresensiValidation, presensiController.updatePresensi);

// Delete Presensi
router.delete("/:id", presensiController.deletePresensi);

module.exports = router;