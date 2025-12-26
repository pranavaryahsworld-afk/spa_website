import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Contact.css";

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
      await axios.post("http://localhost:5000/api/contact", formData);
      toast.success("Message sent successfully");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send message");
    }
  };

  return (
    <section className="contact-page">
      <h2 className="contact-title">Contact Us</h2>

      <div className="contact-container">
        {/* LEFT: FORM */}
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

        {/* RIGHT: COMPANY INFO */}
        <div className="contact-info">
          <h3>WellSpa</h3>
          <p>Relax. Refresh. Renew.</p>

          <div className="info-item">
            📍 <span>Mumbai, Maharashtra, India</span>
          </div>

          <div className="info-item">
            📞 <span>+91 83559 95023</span>
          </div>

          <div className="info-item">
            ✉️ <span>pranavgaikar287@gmail.com</span>
          </div>

          <div className="info-item">
            ⏰ <span>Mon – Sun: 10:00 AM – 9:00 PM</span>
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="map-container">
        <iframe
          title="WellSpa Location"
          src="https://www.google.com/maps?q=Mumbai&output=embed"
          loading="lazy"
        />
      </div>
    </section>
  );
}
