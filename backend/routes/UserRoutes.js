import express from "express";
import {
    createUser
} from "../controllers/UserController.js";
// middleware

const router = express.Router();

router.post('/users', createUser);

export default router;