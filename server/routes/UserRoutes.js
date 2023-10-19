import express from "express";
import {
    createUser,
    getUsers,
    getUsersById,
    updateUsers,
    resetPassUser,
    deleteUser
} from "../controllers/UserController.js";
import { adminOnly, verify } from "../middleware/UserMiddleware.js";

const router = express.Router();

router.post('/users', verify, adminOnly, createUser);
router.get('/users', verify, adminOnly, getUsers);
router.get('/users/:id', verify, adminOnly, getUsersById);
router.patch('/users/:id', verify, adminOnly, updateUsers);
router.patch('/users/reset/:id', verify, adminOnly, resetPassUser);
router.delete('/users/:id', verify, adminOnly, deleteUser);

export default router;