const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require('path');

const app = express();
const PORT = 3001;

// ===============================================
// 1. MIDDLEWARE GLOBAL
// ===============================================
app.use(cors());              // 🔑 CORS harus di atas agar request file statis / routes diizinkan
app.use(express.json());
app.use(morgan("dev"));

// ===============================================
// 2. KONFIGURASI FILE STATIS (SOLUSI GAMBAR)
// ===============================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===============================================
// 3. ROUTER EXISTING
// ===============================================
const authRoutes     = require("./routes/authRoutes");
const presensiRoutes = require("./routes/presensi");
const reportRoutes   = require("./routes/reports");

app.use("/api/auth", authRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

// ===============================================
// 4. ROUTER IOT (Tambahan untuk endpoint /api/iot/ping)
// ===============================================
const iotRoutes = require("./routes/iot");
app.use("/api/iot", iotRoutes);

// ===============================================
// 5. ROOT TEST
// ===============================================
app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// ===============================================
// 6. START SERVER
// ===============================================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
