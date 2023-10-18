import SuratKeluar from "../models/SuratKeluarModel.js";
import Users from "../models/UserModel.js";
// buat validasi di create dan update kalo kodesurat tidak boleh sama
export const createSurat = async(req, res) => {
    const {kodeSurat, perihalSurat, isiSurat, tujuanSurat, tglSurat, tebusanSurat} = req.body;
    try {
        await SuratKeluar.create({
            kodeSurat: kodeSurat,
            perihal: perihalSurat,
            isi: isiSurat,
            tujuan: tujuanSurat,
            tglSurat: tglSurat,
            tebusan: tebusanSurat,
            userId: req.userId
        });
        res.status(201).json({msg: "Data surat keluar berhasil ditambahkan."})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getSurat = async(req, res) => {
    try {
        const suratKeluar = await SuratKeluar.findAll({
            attributes: ['uuid', 'kodeSurat', 'perihal', 'isi', 'tujuan', 'tglSurat', 'tebusan'],
            include: [{
                model: Users,
                attributes: ['nama']
            }]
        });
        res.status(200).json(suratKeluar);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getSuratById = async(req, res) => {
    try {
        const surat = await SuratKeluar.findOne({
           where:{
                uuid: req.params.id
           }
        });
        if(!surat) return res.status(404).json({msg: "Data surat keluar tidak ditemukan."});
        const suratKeluar = await SuratKeluar.findOne({
            attributes: ['uuid', 'kodeSurat', 'perihal', 'isi', 'tujuan', 'tglSurat', 'tebusan'],
            where: {
                id: surat.id
            },
            include: [{
                model: Users,
                attributes: ['nama']
            }]
        });
        res.status(200).json(suratKeluar);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateSurat = async(req, res) => {
    try {
        const surat = await SuratKeluar.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!surat) return res.status(404).json({msg: "Data surat keluar tidak ditemukan."});
        const {kodeSurat, perihalSurat, isiSurat, tujuanSurat, tglSurat, tebusanSurat} = req.body;
        await SuratKeluar.update({
            kodeSurat: kodeSurat,
            perihal: perihalSurat,
            isi: isiSurat,
            tujuan: tujuanSurat,
            tglSurat: tglSurat,
            tebusan: tebusanSurat
        }, {
            where: {
                id: surat.id
            }
        });
        res.status(200).json({msg: "Data surat keluar berhasil diperbarui."});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteSurat = async(req, res) => {
    try {
        const surat = await SuratKeluar.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!surat) return res.status(404).json({msg: "Data surat keluar tidak ditemukan."});
        await SuratKeluar.destroy({
            where: {
                id: surat.id
            }
        });
        res.status(200).json({msg: "Data surat keluar berhasil dihapus."});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}