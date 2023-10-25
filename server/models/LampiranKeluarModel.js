import { Sequelize } from "sequelize";
import db from "../config/database.js";
import SuratKeluar from "./SuratKeluarModel.js";

const { DataTypes } = Sequelize;

const LampiranKeluar = db.define('lampiran_keluar', {
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
    suratKeluarId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

SuratKeluar.hasMany(LampiranKeluar);
LampiranKeluar.belongsTo(SuratKeluar, {foreignKey: "suratKeluarId"})

export default LampiranKeluar;