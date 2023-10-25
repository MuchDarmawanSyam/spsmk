import Users from "../models/UserModel.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";

export const login = async(req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    });

    if(!user) return res.status(404).json({msg: "User tidak ditemukan."});
    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "Password salah."});

    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const nama = user.nama;
    const email = user.email;
    const role = user.role;
    res.status(200).json({uuid, nama, email, role});
}

export const getMe = async(req, res) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "Anda harus login terlebih dahulu"});
    }

    const user = await Users.findOne({
        attributes: ['uuid', 'nama', 'email', 'role', 'fotoprofil', 'url'],
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    res.status(200).json(user);
}

export const updateMe = async(req, res) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "Anda harus login terlebih dahulu"});
    }

    const user = await Users.findOne({
        attributes: ['nama','email','password', 'fotoprofil'],
        where: {
            uuid: req.session.userId
        }
    });

    if(!user) return res.status(404).json({msg: "User tidak ditemukan."});
    let {nama, email, passwordBaru, passwordLama} = req.body;
    const match = await argon2.verify(user.password, passwordLama);
    if(!match) return res.status(400).json({msg: "Password salah."});
    if(nama === "" || nama === null){nama = user.nama}
    if(email === "" || email === null){email = user.email}
    let hashPassword;
    if(passwordBaru === "" || passwordBaru === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(passwordBaru);
    }

    let fileName = "";
    if(req.files === null){
        fileName = user.fotoprofil;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const extention = path.extname(file.name);
        const randNumber = Math.floor(Math.random() * (1000 - 2)) + 2;
        fileName = file.md5 + randNumber + extention;
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
                if(err) return res.status(500).json({msg: err.message});
            });
        }
    }
    const url = `${req.protocol}://${req.get("host")}/profiles/${fileName}`;
    try {
        await Users.update({
            nama: nama,
            email: email,
            password: hashPassword,
            fotoprofil: fileName,
            url: url
        }, {
            where: {
                uuid: req.session.userId
            }
        });
        res.status(200).json({msg: "Data user berhasil diperbarui."});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(400).json({msg: "Tidak dapat logout."});
        res.status(200).json({msg: "Anda telah logout."});
    });
}