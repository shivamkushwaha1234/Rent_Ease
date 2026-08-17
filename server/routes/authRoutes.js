import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { loginUser, registerUser, getProfile, updateProfile } from "../controllers/authController.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
