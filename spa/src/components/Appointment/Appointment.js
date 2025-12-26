import { useEffect, useState } from "react";
import axios from "axios";
import "./Appointment.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Appointment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    treatment: "",
    date: "",
    timeSlot: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* =====================
     PREFILL SERVICE
  ===================== */
  useEffect(() => {
    const selectedService = localStorage.getItem("selectedService");
    if (selectedService) {
      setFormData((prev) => ({
        ...prev,
        treatment: selectedService,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* =====================
     SUBMIT (LOGIN REQUIRED)
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const token = localStorage.getItem("token");

    // 🔐 LOGIN CHECK
    if (!token) {
      toast("Please login to book an appointment");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/appointments",
        formData
      );

      setSuccess("Appointment booked successfully!");
      localStorage.removeItem("selectedService");

      setFormData({
        name: "",
        email: "",
        phone: "",
        treatment: "",
        date: "",
        timeSlot: "",
        message: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <section className="appointment" id="appointment">
      <h2>Book an Appointment</h2>

      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit} className="appointment-form">
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <select
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          required
        >
          <option value="">Select Treatment</option>
          <option>Massage Therapy</option>
          <option>Swedish Massage</option>
          <option>Aromatherapy Massage</option>
          <option>Hot Stone Massage</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <select
          name="timeSlot"
          value={formData.timeSlot}
          onChange={handleChange}
          required
        >
          <option value="">Select Time Slot</option>
          <option>10:00 AM - 11:00 AM</option>
          <option>11:00 AM - 12:00 PM</option>
          <option>12:00 PM - 01:00 PM</option>
          <option>02:00 PM - 03:00 PM</option>
          <option>03:00 PM - 04:00 PM</option>
        </select>

        <textarea
          name="message"
          placeholder="Message (optional)"
          value={formData.message}
          onChange={handleChange}
        />

        <button type="submit">Book Now</button>
      </form>
    </section>
  );
}
