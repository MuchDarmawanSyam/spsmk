import express from "express";
import {login, logout, getMe} from "../controllers/AuthController.js"

const router = express.Router();

router.post('/login', login);
router.get('/me', getMe);
router.delete('/logout', logout);

export default router;