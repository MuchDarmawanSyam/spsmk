import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const SuratMasuk = db.define('surat_masuk', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    kodeSurat: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [12, 20]
        }
    },
    perihal: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    asal: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tglSurat: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tebusan: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

Users.hasMany(SuratMasuk);
SuratMasuk.belongsTo(Users, {foreignKey: "userId"});

export default SuratMasuk;