'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Presensi extends Model {
        static associate(models) {
            Presensi.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });
        }
    }

    Presensi.init({
        userId: { type: DataTypes.INTEGER, allowNull: false },
        tanggal: { type: DataTypes.DATEONLY, allowNull: false },
        check_in: { type: DataTypes.DATE, allowNull: true },
        check_out: { type: DataTypes.DATE, allowNull: true },
        in_latitude: { type: DataTypes.FLOAT, allowNull: true },
        in_longitude: { type: DataTypes.FLOAT, allowNull: true },
        out_latitude: { type: DataTypes.FLOAT, allowNull: true },
        out_longitude: { type: DataTypes.FLOAT, allowNull: true },
        buktiFoto: { type: DataTypes.STRING, allowNull: true } // ✅ Kolom ini sudah benar
    }, {
        sequelize,
        modelName: 'Presensi',
        tableName: 'presensis',
        timestamps: false
    });

    return Presensi;
};