import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { user, product, quantity, tenure } = req.body;

    const existingProduct = await Product.findById(product);
    if (!existingProduct || !existingProduct.available || existingProduct.quantity < 1) {
      return res.status(400).json({ message: "Product is unavailable or out of stock." });
    }

    const existing = await Cart.findOne({ user, product, tenure });

    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();
      return res.json(existing);
    }

    const cartItem = await Cart.create({
      user,
      product,
      quantity: quantity || 1,
      tenure: tenure || 3,
    });

    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.params.userId }).populate("product");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update quantity
export const updateCart = async (req, res) => {
  try {
    const item = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    ).populate("product");

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item
export const removeCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};