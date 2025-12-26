const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

/* ===========================
   CREATE SERVICE (ADMIN)
=========================== */
router.post("/", async (req, res) => {
  try {
    const { title, description, price, duration, image } = req.body;

    if (!title || !description || !price || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const service = await Service.create({
      title,
      description,
      price,
      duration,
      image,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to create service" });
  }
});

/* ===========================
   GET ALL SERVICES (PUBLIC)
=========================== */
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

/* ===========================
   DELETE SERVICE (ADMIN)
=========================== */
router.delete("/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
