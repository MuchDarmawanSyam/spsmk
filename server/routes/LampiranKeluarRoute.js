import express from "express";
import { 
    createAttachment,
    getAllAttachment,
    updateAttachment,
    deleteAttachment
} 
from "../controllers/LampiranKeluarController.js";
import { verify } from "../middleware/UserMiddleware.js";

const router = express.Router();

router.get('/surat/keluar/lampiran', verify, getAllAttachment);
router.post('/surat/keluar/lampiran/:id', verify, createAttachment);
router.patch('/surat/keluar/lampiran/:id', verify, updateAttachment);
router.delete('/surat/keluar/lampiran/:id', verify, deleteAttachment);

export default router;