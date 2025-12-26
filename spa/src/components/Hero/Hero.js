import "./Hero.css";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const scrollToAppointment = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const section = document.getElementById("appointment");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-title">
          Relax. Rejuvenate. <br />
          <span>Renew Yourself</span>
        </h1>

        <p className="hero-subtitle">
          Experience luxury spa therapies crafted to refresh your body,
          calm your mind, and restore balance.
        </p>

        <div className="hero-actions">
          <button className="btn primary" onClick={scrollToAppointment}>
            Book Appointment
          </button>

          <button
            className="btn secondary"
            onClick={() => navigate("/services")}
          >
            Explore Services
          </button>
        </div>
      </div>
    </section>
  );
}
