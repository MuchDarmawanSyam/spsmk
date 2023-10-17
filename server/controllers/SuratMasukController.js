import SuratMasuk from "../models/SuratMasukModel.js";
import Users from "../models/UserModel.js";
// buat validasi di create dan update kalo kodesurat tidak boleh sama
export const createSurat = async(req, res) => {
    const {kodeSurat, perihalSurat, isiSurat, asalSurat, tglSurat, tebusanSurat} = req.body;
    try {
        await SuratMasuk.create({
            kodeSurat: kodeSurat,
            perihal: perihalSurat,
            isi: isiSurat,
            asal: asalSurat,
            tglSurat: tglSurat,
            tebusan: tebusanSurat,
            userId: req.userId
        });
        res.status(201).json({msg: "Data surat masuk berhasil ditambah."});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getSurat = async(req, res) => {
    try {
        const suratMasuk = await SuratMasuk.findAll({
            attributes: ['uuid', 'kodeSurat', 'perihal', 'isi', 'asal', 'tglSurat', 'tebusan'],
            include: [{
                model: Users,
                attributes: ['nama']
            }]
        });
        res.status(200).json(suratMasuk);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getSuratById = async(req, res) => {
    try {
        const surat = await SuratMasuk.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!surat) return res.status(404).json({msg: "Data surat masuk tidak ditemukan."});
        const suratMasuk = await SuratMasuk.findOne({
            attributes: ['uuid', 'kodeSurat', 'perihal', 'isi', 'asal', 'tglSurat', 'tebusan'],
            where: {
                id: surat.id
            },
            include: [{
                model: Users,
                attributes: ['nama']
            }]
         });
         res.status(200).json(suratMasuk);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateSurat = async(req, res) => {
    try {
        const surat = await SuratMasuk.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!surat) return res.status(404).json({msg: "Data surat masuk tidak ditemukan."});
        const {kodeSurat, perihalSurat, isiSurat, asalSurat, tglSurat, tebusanSurat} = req.body;
        await SuratMasuk.update({
            kodeSurat: kodeSurat,
            perihal: perihalSurat,
            isi: isiSurat,
            asal: asalSurat,
            tglSurat: tglSurat,
            tebusan: tebusanSurat
        }, {
            where: {
                id: surat.id
            }
        });
        res.status(200).json({msg: "Data surat masuk berhasil diperbarui."});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteSurat = async(req, res) => {
    try {
        const surat = await SuratMasuk.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!surat) return res.status(404).json({msg: "Data surat masuk tidak ditemukan."});
        await SuratMasuk.destroy({
            where: {
                id: surat.id
            }
        });
        res.status(200).json({msg: "Data surat masuk berhasil dihapus."});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}