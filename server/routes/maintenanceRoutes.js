import express from "express";
import { createMaintenanceRequest, getUserMaintenanceRequests } from "../controllers/maintenanceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create maintenance request (authenticated user)
router.post("/", authMiddleware, createMaintenanceRequest);

// Get maintenance requests for a user
router.get("/user/:userId", authMiddleware, getUserMaintenanceRequests);

export default router;
