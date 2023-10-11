import express from "express";
import {
    createUser,
    getUsers,
    deleteUser
} from "../controllers/UserController.js";
// middleware

const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

export default router;