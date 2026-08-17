import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeCartItem,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addToCart);
router.get("/:userId", authMiddleware, getCart);
router.put("/:id", authMiddleware, updateCart);
router.delete("/:id", authMiddleware, removeCartItem);

export default router;