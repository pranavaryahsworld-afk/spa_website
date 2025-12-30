const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

/* =====================
   CREATE APPOINTMENT (USER)
===================== */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, treatment, date, timeSlot, message } = req.body;

    if (!name || !email || !phone || !treatment || !date || !timeSlot) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const appointment = await Appointment.create({
      name,
      email,
      phone,
      treatment,
      date,
      timeSlot,
      message,
      status: "pending",
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Failed to book appointment" });
  }
});

/* =====================
   GET ALL APPOINTMENTS (ADMIN)
===================== */
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

/* =====================
   UPDATE STATUS (ADMIN)
===================== */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});

/* =====================
   DELETE APPOINTMENT (ADMIN)
===================== */
router.delete("/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
