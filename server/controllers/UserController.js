import Users from "../models/UserModel.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
export const createUser = async(req, res) => {
    const {nama, email, password, cPassword, role} = req.body;
    if (password !== cPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok."});
    const hashPassword = await argon2.hash(password);
    const url = `${req.protocol}://${req.get("host")}/profiles/Default.jpg`;
    // buat validasi user hanya boleh jadi admin/petugas
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

// Buat ketika profil Default tambah gambar tanpa hapus,kalo bukan update (hapus & tambah) gambar
export const updateUsers = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });

    if(!user) return res.status(404).json({msg: "User tidak ditemukan."});
    const {nama, email, password, cPassword, role} = req.body;
    let hashPassowrd;
    if(password === "" || password === null){
        hashPassowrd = user.password
    }else{
        hashPassowrd = await argon2.hash(password);
    }
    if(password !== cPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok."});
    let fileName = "";
    if(req.files === null){
        fileName = user.fotoprofil;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const extention = path.extname(file.name);
        const randomNumber = Math.floor(Math.random() * (1000 - 2)) + 2;
        fileName = file.md5 + randomNumber + extention;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(extention.toLowerCase())) return res.status(422).json({msg: "Format gambar harus (png, jpg atau jpeg)."});
        if(fileSize > 1000000) return res.status(422).json({msg: "Ukuran gambar harus kurang dari 1 MB"});
        if(user.fotoprofil == "Default.jpg"){
            file.mv(`./public/profiles/${fileName}`, (err) => {
                if(err) return res.status(500).json({msd: err.message});
            });
        }else{
            const filepath = `./public/profiles/${user.fotoprofil}`;
            fs.unlinkSync(filepath);

            file.mv(`./public/profiles/${fileName}`, (err) => {
                if(err) return res.status(500).json({msd: err.message});
            });
        }
    }
    const url = `${req.protocol}://${req.get("host")}/profiles/${fileName}`;
    // tambah verifikasi dimana update role hanya admin, kalo petugas tdk bisa
    // buat pengecekan jika admin maka tidak perlu masukan password lama
    // buat fungsi UpdateMe untuk mengubah data diri sendiri, beda dengan updateUser khusus admin
    try {
        await Users.update({
            nama: nama,
            email: email,
            password: hashPassowrd,
            role: role,
            fotoprofil: fileName,
            url: url
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

export const deleteUser = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });

    if(!user) return res.status(404).json({msg: "User tidak ditemukan."});
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