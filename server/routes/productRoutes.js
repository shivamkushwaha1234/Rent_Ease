import express from "express";
import {
getProducts,
getProduct,
createProduct,
updateProduct,
deleteProduct,
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProduct);

// Add new product
router.post("/", authMiddleware, adminMiddleware, createProduct);

// Update product
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// Delete product
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
