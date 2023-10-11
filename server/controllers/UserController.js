import Users from "../models/UserModel.js";
import argon2 from "argon2";
export const createUser = async(req, res) => {
    const {name, email, password, cPassword, role, profil} = req.body;
    if (password !== cPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok."});
    const hashPassowrd = await argon2.hash(password);
    try {
        await Users.create({
            nama: name,
            email: email,
            password: hashPassowrd,
            role: role,
            fotoprofil: profil
        });
        res.status(201).json({msg: "Tambah data petugas berhasil."});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}