import { useEffect, useState } from "react";
import axios from "axios";
import "../components/Services/Services.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setLoading(false);
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
    <section className="services-page">
      <h2 className="section-title">Our Services</h2>

      {loading && <p className="empty">Loading services...</p>}
      {!loading && services.length === 0 && (
        <p className="empty">No services available</p>
      )}

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
    </section>
  );
}
