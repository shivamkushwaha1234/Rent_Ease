import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find().populate("items.product");
    const maintenanceRequests = await MaintenanceRequest.find();
    const products = await Product.find();

    let revenue = 0;
    let activeRentals = 0;
    const rentedQuantities = new Map();
    const usersWithOrders = new Map();

    orders.forEach((order) => {
      const isActive = ["Approved", "Delivered"].includes(order.status);

      if (isActive) {
        activeRentals += 1;
      }

      order.items.forEach((item) => {
        if (item.product) {
          revenue += item.product.monthlyRent * item.quantity;

          if (isActive) {
            const previous = rentedQuantities.get(item.product._id.toString()) || 0;
            rentedQuantities.set(item.product._id.toString(), previous + item.quantity);
          }
        }
      });

      if (order.user) {
        const userId = order.user.toString();
        usersWithOrders.set(userId, (usersWithOrders.get(userId) || 0) + 1);
      }
    });

    const totalInventory = products.reduce((sum, product) => sum + (product.quantity || 0), 0);
    const rentedCount = Array.from(rentedQuantities.values()).reduce((sum, qty) => sum + qty, 0);
    const utilizationRate = totalInventory > 0 ? Math.min((rentedCount / totalInventory) * 100, 100) : 0;

    const repeatCustomers = Array.from(usersWithOrders.values()).filter((count) => count > 1).length;
    const customerRetentionRate = usersWithOrders.size > 0 ? (repeatCustomers / usersWithOrders.size) * 100 : 0;

    const resolvedRequests = maintenanceRequests.filter((request) => request.status === "Resolved" && request.updatedAt && request.createdAt);
    const totalResolutionMs = resolvedRequests.reduce((sum, request) => sum + (new Date(request.updatedAt) - new Date(request.createdAt)), 0);
    const averageResolutionDays = resolvedRequests.length > 0 ? totalResolutionMs / resolvedRequests.length / (1000 * 60 * 60 * 24) : 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      revenue,
      activeRentals,
      utilizationRate: Number(utilizationRate.toFixed(1)),
      customerRetentionRate: Number(customerRetentionRate.toFixed(1)),
      averageResolutionDays: Number(averageResolutionDays.toFixed(1)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find().populate("user", "name email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMaintenanceRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMaintenanceRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
