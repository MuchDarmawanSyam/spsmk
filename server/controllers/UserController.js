import Users from "../models/UserModel.js";
import argon2 from "argon2";
import fs from "fs";

export const createUser = async(req, res) => {
    const {nama, email, password, cPassword, role} = req.body;
    if (password !== cPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok."});
    const hashPassword = await argon2.hash(password);
    const url = `${req.protocol}://${req.get("host")}/profiles/Default.jpg`;
    if(role !== "admin" && role !== "petugas") return res.status(403).json({msg: "Role tidak sesuai."});
    try {
        await Users.create({
            nama: nama,
            email: email,
            password: hashPassword,
            role: role,
            fotoprofil: "Default.jpg",
            url: url
        });
        res.status(201).json({msg: "Data petugas berhasil ditambah."});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const getUsers = async(req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ['uuid', 'nama', 'email', 'role', 'fotoprofil', 'url']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUsersById = async(req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ['uuid', 'nama', 'email', 'role', 'fotoprofil', 'url'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateUsers = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });
    const admin = await Users.count({
        where: {
            role: "admin"
        }
    })

    if(!user) return res.status(404).json({msg: "User tidak ditemukan."});
    const role = req.body.role;
    if(role !== "admin" && role !== "petugas") return res.status(403).json({msg: "Role tidak sesuai."});
    if(admin == 1 && role == "petugas") return res.status(403).json({msg: "Role admin tidak boleh kosong."});
    try {
        await Users.update({
            role: role
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({msg: "Data user berhasil diperbarui."});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const resetPassUser = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });

    if(!user) return res.status(404).json({msg: "User tidak ditemukan."});
    let newPassword;
    if(user.role == "admin"){
        newPassword = await argon2.hash("admin123");
    }else{
        newPassword = await argon2.hash("petugas123");
    }

    try {
        await Users.update({
            password: newPassword
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({msg: "Password user berhasil direset."});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteUser = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });

    if(!user) return res.status(404).json({msg: "User tidak ditemukan."});
    if(user.fotoprofil != "Default.jpg"){
        fs.unlinkSync(`./public/profiles/${user.fotoprofil}`);
    }
    try {
        await Users.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({msg: "Data user berhasil dihapus."});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}