import express from "express";
import {
    createUser,
    getUsers,
    getUsersById,
    updateUsers,
    deleteUser
} from "../controllers/UserController.js";
// middleware

const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.patch('/users/:id', updateUsers);
router.delete('/users/:id', deleteUser);

export default router;