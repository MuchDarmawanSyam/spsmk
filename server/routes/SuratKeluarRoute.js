import express from "express";
import {
    createSurat,
    getSurat,
    getSuratById,
    updateSurat,
    deleteSurat
} from "../controllers/SuratKeluarController.js";
import { verify } from "../middleware/UserMiddleware.js";

const router = express.Router();

router.post('/surat/keluar', verify, createSurat);
router.get('/surat/keluar', getSurat);
router.get('/surat/keluar/:id', getSuratById);
router.patch('/surat/keluar/:id', updateSurat);
router.delete('/surat/keluar/:id', deleteSurat);

export default router;