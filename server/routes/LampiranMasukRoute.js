import express from "express";
import { 
    createAttachment,
    getAllAttachment,
    updateAttachment,
    deleteAttachment
} 
from "../controllers/LampiranMasukController.js";
import { verify } from "../middleware/UserMiddleware.js";

const router = express.Router();

router.get('/surat/masuk/lampiran', verify, getAllAttachment);
router.post('/surat/masuk/lampiran/:id', verify, createAttachment);
router.patch('/surat/masuk/lampiran/:id', verify, updateAttachment);
router.delete('/surat/masuk/lampiran/:id', verify, deleteAttachment);

export default router;