import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getServiceProviders,
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
} from "../controllers/providerController.js";

const router = express.Router();

router.get("/", getServiceProviders);
router.post("/", authMiddleware, adminMiddleware, createServiceProvider);
router.put("/:id", authMiddleware, adminMiddleware, updateServiceProvider);
router.delete("/:id", authMiddleware, adminMiddleware, deleteServiceProvider);

export default router;
