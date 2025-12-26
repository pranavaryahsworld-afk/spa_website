const Service = require("../models/Service");

/* =========================
   CREATE SERVICE (ADMIN)
========================= */
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: "Failed to create service" });
  }
};

/* =========================
   GET ALL SERVICES (PUBLIC)
========================= */
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

/* =========================
   DELETE SERVICE (ADMIN)
========================= */
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
