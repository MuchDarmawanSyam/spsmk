import express from "express";
import {login, logout, getMe, updateMe} from "../controllers/AuthController.js"

const router = express.Router();

router.post('/login', login);
router.get('/me', getMe);
router.patch('/update', updateMe);
router.delete('/logout', logout);

export default router;