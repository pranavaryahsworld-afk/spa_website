import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Contact.css";
import API_BASE_URL from "../../utils/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/api/contact`, formData);
      toast.success("Message sent successfully");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <section className="contact-page">
      <h2 className="contact-title">Contact Us</h2>

      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="row">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Mobile Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit" className="send-btn">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
