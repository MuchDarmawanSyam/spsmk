import Users from "../models/UserModel.js";
import argon2 from "argon2";
export const createUser = async(req, res) => {
    const {nama, email, password, cPassword, role, profil} = req.body;
    if (password !== cPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok."});
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            nama: nama,
            email: email,
            password: hashPassword,
            role: role,
            fotoprofil: profil
        });
        res.status(201).json({msg: "Data petugas berhasil ditambah."});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const getUsers = async(req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ['uuid', 'nama', 'email', 'role', 'fotoprofil']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUsersById = async(req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ['uuid', 'nama', 'email', 'role', 'fotoprofil'],
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

    if(!user) return res.status(404).json({msg: "User tidak ditemukan."});
    const {nama, email, password, cPassword, role, profil} = req.body;
    let hashPassowrd;
    if(password === "" || password === null){
        hashPassowrd = user.password
    }else{
        hashPassowrd = await argon2.hash(password);
    }
    if(password !== cPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok."});

    try {
        await Users.update({
            nama: nama,
            email: email,
            password: hashPassowrd,
            role: role,
            fotoprofil: profil
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