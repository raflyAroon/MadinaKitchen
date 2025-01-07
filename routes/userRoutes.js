import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updatePassword
} from "../models/userModel.js";
import { 
    getUserProfile,
    updateUserProfile
} from "../controllers/authController.js";

const router = express.Router();

// Route: Mendapatkan semua user (hanya untuk admin)
router.get("/", verifyToken, getAllUsers);

// Route: Mendapatkan user berdasarkan ID
router.get("/:id", verifyToken, getUserById);

// Route: Mengupdate data user
router.put("/:id", verifyToken, updateUser);

// Route: Menghapus user berdasarkan ID
router.delete("/:id", verifyToken, deleteUser);

// Route: Mengupdate password user
router.put("/:id/password", verifyToken, updatePassword);

// Route: Mendapatkan profil user
router.get('/profile', verifyToken, getUserProfile);

// Route: Mengupdate profil user
router.put('/profile', verifyToken, updateUserProfile);

export default router;
