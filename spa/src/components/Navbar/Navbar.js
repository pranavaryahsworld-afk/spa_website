import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            WellSpa
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Navigation */}
        <nav className={menuOpen ? "open" : ""}>
          <ul className="nav-links">
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
            <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
            <li><Link to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
            <li><Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>

            {role === "admin" && (
              <li>
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              </li>
            )}

            {/* ✅ MOBILE AUTH LINKS */}
            <li className="mobile-auth">
              {!token ? (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <span className="user-name">Hi, {name}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </>
              )}
            </li>
          </ul>
        </nav>

        {/* ✅ DESKTOP AUTH ONLY */}
        <div className="auth-links desktop-only">
          {!token ? (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </>
          ) : (
            <>
              <span className="user-name">Hi, {name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
