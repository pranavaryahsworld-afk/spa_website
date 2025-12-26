import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ServiceSection.css";
import { toast } from "react-hot-toast";

export default function ServiceSection() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  };

  const handleBookNow = (serviceTitle) => {
    localStorage.setItem("selectedService", serviceTitle);

    const token = localStorage.getItem("token");
    if (!token) {
      toast("Please login to book an appointment");

      navigate("/login");
    } else {
      navigate("/#appointment");
    }
  };

  return (
    <section className="service-section">
      <h2 className="section-title">Our Services</h2>

      <div className="services-grid">
        {services.map((s) => (
          <div className="service-card" key={s._id}>
            <div className="image-wrapper">
              <img src={s.image} alt={s.title} />
              <div className="overlay">
                <button
                  className="overlay-btn"
                  onClick={() => handleBookNow(s.title)}
                >
                  Book Now
                </button>
              </div>
            </div>

            <div className="service-info">
              <h3>{s.title}</h3>
              <p>{s.description}</p>

              <div className="service-meta">
                <span className="price">₹{s.price}</span>
                <span className="duration">{s.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="view-all">
        <button onClick={() => navigate("/services")}>
          View All Services
        </button>
      </div>
    </section>
  );
}
