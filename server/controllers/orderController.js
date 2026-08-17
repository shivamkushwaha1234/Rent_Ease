import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const calculateReturnDate = (deliveryDate, months) => {
  const date = new Date(deliveryDate);
  if (Number.isNaN(date.getTime())) return null;
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split("T")[0];
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const { deliveryDate, deliveryAddress, deliveryArea, paymentMethod } = req.body;
    const user = req.user.id;

    const cartItems = await Cart.find({ user }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const invalidStock = cartItems.find(
      (item) => !item.product.available || item.product.quantity < item.quantity
    );

    if (invalidStock) {
      return res.status(400).json({
        message: `${invalidStock.product.name} is currently unavailable or out of stock.`,
      });
    }

    const serviceAreaMismatch = cartItems.find((item) => {
      const productArea = item.product.serviceArea || "All";
      return productArea !== "All" && productArea !== deliveryArea;
    });

    if (serviceAreaMismatch) {
      return res.status(400).json({
        message: `${serviceAreaMismatch.product.name} is not available in the selected delivery area.`,
      });
    }

    const items = cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      tenure: item.tenure || 3,
    }));

    const totalAmount = cartItems.reduce((sum, item) => {
      const tenure = item.tenure || 3;
      return sum + item.product.monthlyRent * item.quantity * tenure;
    }, 0);

    const depositAmount = cartItems.reduce((sum, item) => {
      return sum + item.product.securityDeposit * item.quantity;
    }, 0);

    const maxTenure = Math.max(...items.map((item) => item.tenure || 3));
    const returnDate = calculateReturnDate(deliveryDate, maxTenure);

    const paymentStatus = paymentMethod === "Card" ? "Paid" : "Pending";

    const order = await Order.create({
      user,
      items,
      deliveryDate,
      deliveryArea,
      returnDate,
      deliveryAddress,
      paymentMethod: paymentMethod || "Cash",
      paymentStatus,
      totalAmount,
      depositAmount,
      status: paymentMethod === "Card" ? "Approved" : "Pending",
    });

    // Decrement inventory
    for (const item of cartItems) {
      item.product.quantity -= item.quantity;
      if (item.product.quantity <= 0) {
        item.product.quantity = 0;
        item.product.available = false;
      }
      await item.product.save();
    }

    // Clear cart
    await Cart.deleteMany({ user });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get orders for a specific user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Renter requests return/pickup
export const requestReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this order." });
    }

    if (!["Delivered", "Approved"].includes(order.status)) {
      return res.status(400).json({ message: "Return cannot be requested at this stage" });
    }

    if (req.body.pickupDate) {
      order.pickupDate = req.body.pickupDate;
    }

    order.status = "Return Requested";
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin) with automatic inventory restock on Returned
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldStatus = order.status;
    const newStatus = req.body.status;

    if (req.body.status) order.status = req.body.status;
    if (req.body.pickupDate) order.pickupDate = req.body.pickupDate;
    if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;

    // Restock stock when item is marked Returned
    if (oldStatus !== "Returned" && newStatus === "Returned") {
      for (const item of order.items) {
        if (item.product) {
          const prod = await Product.findById(item.product);
          if (prod) {
            prod.quantity = (prod.quantity || 0) + item.quantity;
            prod.available = true;
            await prod.save();
          }
        }
      }
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
