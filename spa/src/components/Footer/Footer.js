import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h3>WellSpa</h3>
          <p>Relax. Refresh. Renew.</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Social */}
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="icons">
            <span>🌐</span>
            <span>📘</span>
            <span>📸</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2025 WellSpa. All rights reserved.
      </div>
    </footer>
  );
}
