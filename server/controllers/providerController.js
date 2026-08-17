import ServiceProvider from "../models/ServiceProvider.js";

export const getServiceProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createServiceProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.create(req.body);
    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateServiceProvider = async (req, res) => {
  try {
    const updatedProvider = await ServiceProvider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedProvider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteServiceProvider = async (req, res) => {
  try {
    await ServiceProvider.findByIdAndDelete(req.params.id);
    res.json({ message: "Service provider deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
