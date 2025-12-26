const Appointment = require("../models/Appointment");
const nodemailer = require("nodemailer");

/* ===========================
   CREATE APPOINTMENT
=========================== */
exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (error) {
    res.status(500).json({ message: "Booking failed" });
  }
};

/* ===========================
   GET ALL APPOINTMENTS (ADMIN)
=========================== */
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/* ===========================
   UPDATE STATUS (ADMIN)
=========================== */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    /* =====================
       SEND EMAIL TO USER
    ===================== */
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"WellSpa" <${process.env.EMAIL_USER}>`,
      to: appointment.email, // 👈 make sure this exists in Appointment model
      subject:
        status === "approved"
          ? "Your Appointment is Approved"
          : "Your Appointment is Rejected",
      text:
        status === "approved"
          ? `Hello ${appointment.name},\n\nYour appointment for ${appointment.treatment} on ${appointment.date} at ${appointment.timeSlot} has been APPROVED.\n\nWe look forward to seeing you.\n\nWellSpa`
          : `Hello ${appointment.name},\n\nUnfortunately, your appointment for ${appointment.treatment} on ${appointment.date} at ${appointment.timeSlot} has been REJECTED.\n\nPlease contact us for rescheduling.\n\nWellSpa`,
    });

    res.json({ message: "Status updated and email sent", appointment });
  } catch (error) {
    console.error("APPOINTMENT EMAIL ERROR:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ===========================
   DELETE APPOINTMENT (ADMIN)
=========================== */
exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
