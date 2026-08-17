import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  requestReturn,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// User routes
router.post("/", authMiddleware, createOrder);
router.get("/user/:id", authMiddleware, getUserOrders);
router.put("/user/return/:id", authMiddleware, requestReturn);

// Admin routes
router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrders);
router.put("/admin/:id", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
