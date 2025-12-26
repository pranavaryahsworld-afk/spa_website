const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/appointmentController");

// Create appointment
router.post("/", createAppointment);

// Admin: get all
router.get("/", getAllAppointments);

// Admin: update status
router.put("/:id/status", updateAppointmentStatus);

// Admin: delete
router.delete("/:id", deleteAppointment);

module.exports = router;
