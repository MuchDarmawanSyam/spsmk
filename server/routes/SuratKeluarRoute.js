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
router.get('/surat/keluar', verify, getSurat);
router.get('/surat/keluar/:id', verify, getSuratById);
router.patch('/surat/keluar/:id', verify, updateSurat);
router.delete('/surat/keluar/:id', verify, deleteSurat);

export default router;