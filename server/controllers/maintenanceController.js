import MaintenanceRequest from "../models/MaintenanceRequest.js";

export const createMaintenanceRequest = async (req, res) => {
  try {
    const { user, order, product, type, title, description } = req.body;

    if (!user || !title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const request = await MaintenanceRequest.create({
      user,
      order,
      product,
      type,
      title,
      description,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ user: req.params.userId })
      .populate("order")
      .populate("product");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
