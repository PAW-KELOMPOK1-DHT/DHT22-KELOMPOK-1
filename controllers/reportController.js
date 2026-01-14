const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
    try {
        // ✅ Menggunakan nama parameter dari frontend: nama, tanggalMulai, tanggalSelesai
        const { nama, tanggalMulai, tanggalSelesai } = req.query;

        let whereClause = {}; // Untuk filter Presensi
        
        // 1. Filter Tanggal (Presensi.tanggal)
        if (tanggalMulai && tanggalSelesai) {
            whereClause.tanggal = {
                [Op.between]: [tanggalMulai, tanggalSelesai]
            };
        } else if (tanggalMulai) {
            whereClause.tanggal = {
                [Op.gte]: tanggalMulai
            };
        } else if (tanggalSelesai) {
            whereClause.tanggal = {
                [Op.lte]: tanggalSelesai
            };
        }

        // 2. Filter Nama User (User.nama)
        // Jika nama diisi, filter dimasukkan ke whereClause menggunakan sintaks relasi '$model.column$'
        if (nama) {
            // Menggunakan sintaks untuk mencari kolom di model include
            whereClause['$user.nama$'] = {
                [Op.iLike]: `%${nama}%` // Op.iLike untuk Case-Insensitive (PostgreSQL/SQLite)
                // Jika Anda menggunakan MySQL, gunakan [Op.like]
                // [Op.like]: `%${nama}%`
            };
        }

        const options = {
            where: whereClause, // Gunakan whereClause yang sudah difilter di atas
            include: [
                {
                    model: User,
                    as: "user", // Harus sesuai dengan asosiasi di model Presensi
                    attributes: ["id", "nama", "email"],
                }
            ],
            order: [
                ["tanggal", "DESC"],
                ["check_in", "DESC"]
            ]
        };
        
        // ⚠️ PENTING: Jika options.where.$user.nama$ diisi, Anda harus menggunakan atribut 'required: true'
        // agar JOIN yang terjadi adalah INNER JOIN (hanya tampilkan data yang cocok dengan user)
        if (nama) {
             options.include[0].required = true;
        }


        // 3. Ambil data
        const records = await Presensi.findAll(options);

        // 4. Format data untuk frontend (Mapping snake_case ke camelCase)
        const formatted = records.map(r => ({
            id: r.id,
            // ✅ KOREKSI: Mengambil kolom check_in dan check_out
            checkIn: r.check_in, 
            checkOut: r.check_out,
            // ✅ KOREKSI: Menambahkan buktiFoto
            buktiFoto: r.buktiFoto, 
            user: r.user
                ? {
                      id: r.user.id,
                      nama: r.user.nama,
                      email: r.user.email
                  }
                : null
        }));

        res.json({
            status: true,
            count: formatted.length,
            data: formatted
        });

    } catch (error) {
        console.error("Report error:", error);
        res.status(500).json({
            status: false,
            message: "Gagal mengambil laporan",
            error: error.message
        });
    }
};