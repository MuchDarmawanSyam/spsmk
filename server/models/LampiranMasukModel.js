import { Sequelize } from "sequelize";
import db from "../config/database.js";
import SuratMasuk from "./SuratMasukModel.js";

const { DataTypes } = Sequelize;

const LampiranMasuk = db.define('lampiran_masuk', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    namaLampiran: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    suratMasukId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

SuratMasuk.hasMany(LampiranMasuk);
LampiranMasuk.belongsTo(SuratMasuk, {foreignKey: "suratMasukId"})

export default LampiranMasuk;