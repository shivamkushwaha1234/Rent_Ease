import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getDashboardStats,
  getMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", getDashboardStats);

router.get("/users", getUsers);
router.put("/users/:id", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/maintenance", getMaintenanceRequests);
router.post("/maintenance", createMaintenanceRequest);
router.put("/maintenance/:id", updateMaintenanceRequest);

router.get("/products", getProducts);
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
