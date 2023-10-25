import LampiranKeluar from "../models/LampiranKeluarModel.js";
import SuratKeluar from "../models/SuratKeluarModel.js";
import path from "path";
import { unlinkSync } from "fs";

export const createAttachment = async(req, res) => {
    const letter = await SuratKeluar.findOne({attributes: ['id', 'kodeSurat'], where: {uuid: req.params.id}});
    if(!letter) res.status(404).json({msg: "Data surat tidak ditemukan."});
    if(req.files === null){
        res.status(404).json({msg: "Data lampiran tidak ditemukan."});
    }else{
        const file = req.files.file;
        const fileSize = file.data.lenght;
        const extention = path.extname(file.name);
        const randNumber = Math.floor(Math.random() * (1000 - 2)) + 2;
        const fileName = letter.kodeSurat.replace(/[/]/g, "-") + "_" + randNumber + extention;
        const allowedType = ['.png', '.jpg', '.jpeg', '.pdf'];

        if(!allowedType.includes(extention.toLowerCase())) return res.status(422).json({msg: "Format file lampiran harus (png, jpg, jpeg, dan pdf)."});
        if(fileSize > 2000000) return res.status(422).json({msg: "Ukuran file lampiran harus dibawah 2MB."});
        try{
            file.mv(`./public/attachments/outgoing/${fileName}`, (err) => {
                if(err) return res.status(500).json({msg: err.message});
            });
            const url = `${req.protocol}://${req.get("host")}/attachments/outgoing/${fileName}`;
            await LampiranKeluar.create({
                namaLampiran: fileName,
                url: url,
                suratKeluarId: letter.id
            });
            return res.status(201).json({msg: "Data lampiran surat keluar berhasil ditambahkan."});
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    }
}

export const getAllAttachment = async(req, res) => {
    try {
        const attachments = await LampiranKeluar.findAll({
            attributes: ['uuid', 'namaLampiran', 'url'],
            include: [{
                model: SuratKeluar,
                attributes: ['kodeSurat']
            }]
        });
        return res.status(200).json(attachments);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateAttachment = async(req, res) => {
    const attachments = await LampiranKeluar.findOne({
        attributes: ['id', 'namaLampiran'],
        where: {
            uuid: req.params.id
        }
    });
    if(!attachments) return res.status(404).json({msg: "Lampiran tidak ditemukan."});
    if(req.files === null){
        res.status(404).json({msg: "Data lampiran tidak ditemukan."});
    }else{
        const file = req.files.file;
        const fileSize = file.data.lenght;
        const extention = path.extname(file.name);
        const randNumber = Math.floor(Math.random() * (1000 - 2)) + 2;
        const fileName = attachments.namaLampiran.split("_")[0] + "_" + randNumber + extention;
        const allowedType = ['.png', '.jpg', '.jpeg', '.pdf'];

        if(!allowedType.includes(extention.toLowerCase())) return res.status(422).json({msg: "Format file lampiran harus (png, jpg, jpeg, dan pdf)."});
        if(fileSize > 2000000) return res.status(422).json({msg: "Ukuran file lampiran harus dibawah 2MB."});
        try{
            file.mv(`./public/attachments/outgoing/${fileName}`, (err) => {
                if(err) return res.status(500).json({msg: err.message});
            });
            unlinkSync(`./public/attachments/outgoing/${attachments.namaLampiran}`);

            const url = `${req.protocol}://${req.get("host")}/attachments/outgoing/${fileName}`;
            await LampiranKeluar.update({
                namaLampiran: fileName,
                url: url
            },{
                where: {
                    id: attachments.id
                }
            });
            return res.status(201).json({msg: "Data lampiran surat keluar berhasil diperbarui."});
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    }
}

export const deleteAttachment = async(req, res) => {
    try {
        const attachments = await LampiranKeluar.findOne({where: {uuid: req.params.id}});
        if(!attachments) return res.status(404).json({msg: "Data lampiran tidak ditemukan."});
        unlinkSync(`./public/attachments/outgoing/${attachments.namaLampiran}`);
        await LampiranKeluar.destroy({where: {id: attachments.id}});
        
        res.status(200).json({msg: "Data lampiran berhasil dihapus"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}