const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/* =====================
   GET ALL APPOINTMENTS (ADMIN)
===================== */
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

/* =====================
   UPDATE STATUS + SEND EMAIL (ADMIN)
===================== */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    /* ---------- EMAIL ---------- */
    const subject =
      status === "approved"
        ? "Appointment Approved – WellSpa 🌿"
        : "Appointment Rejected – WellSpa";

    const message =
      status === "approved"
        ? `
          <p>Hello ${appointment.name},</p>
          <p>Your appointment for <b>${appointment.treatment}</b> on 
          <b>${appointment.date}</b> at <b>${appointment.timeSlot}</b> 
          has been <b>APPROVED</b>.</p>
          <p>We look forward to welcoming you 🌿</p>
          <p>— WellSpa Team</p>
        `
        : `
          <p>Hello ${appointment.name},</p>
          <p>Unfortunately, your appointment for <b>${appointment.treatment}</b> 
          on <b>${appointment.date}</b> at <b>${appointment.timeSlot}</b> 
          has been <b>REJECTED</b>.</p>
          <p>Please contact us to reschedule.</p>
          <p>— WellSpa Team</p>
        `;

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: appointment.email,
      subject,
      html: message,
    });

    res.json({ success: true, appointment });
  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
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
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
