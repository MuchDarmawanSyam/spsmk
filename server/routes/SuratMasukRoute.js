import express from "express";
import { getSurat } from "../controllers/SuratMasukController.js";

const router = express.Router();

router.get('/surat/masuk', getSurat);

export default router;
