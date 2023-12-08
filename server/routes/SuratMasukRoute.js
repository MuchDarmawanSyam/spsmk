import express from "express";
import { 
    getSurat,
    createSurat,
    getSuratById,
    updateSurat,
    deleteSurat
} from "../controllers/SuratMasukController.js";
import {
    verify
} from "../middleware/UserMiddleware.js";

const router = express.Router();

router.get('/surat/masuk', verify, getSurat);
router.post('/surat/masuk', verify, createSurat);
router.get('/surat/masuk/:id', verify, getSuratById);
router.patch('/surat/masuk/:id', verify, updateSurat);
router.delete('/surat/masuk/:id', verify, deleteSurat);

export default router;
