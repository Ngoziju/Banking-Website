import { useState } from "react";
import logoImage from "../assets/p logog.png";
import ThemeToggle from "./ThemeToggle";

function Navbar({ onLoginClick, onRegisterClick, theme, onThemeToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <a className="logo" href="#" aria-label="PayNest home">
        <span className="logo-icon">
          <img src={logoImage} alt="" />
        </span>
        <span>PayNest</span>
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        <span
          className={`menu-toggle-icon${menuOpen ? " is-open" : ""}`}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </span>
      </button>

      <div
        className={`navigation-content${menuOpen ? " is-open" : ""}`}
        id="primary-navigation"
      >
        <div className="nav-links">
          <a href="#" onClick={closeMenu}>Home</a>
          <a href="#" onClick={closeMenu}>Products</a>
          <a href="#" onClick={closeMenu}>Solutions</a>
          <a href="#" onClick={closeMenu}>Pricing</a>
          <a href="#" onClick={closeMenu}>Resources</a>
        </div>

        <div className="nav-buttons">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <button
            className="login-btn"
            type="button"
            onClick={() => {
              closeMenu();
              onLoginClick();
            }}
          >
            Log In
          </button>
          <button
            className="start-btn"
            type="button"
            onClick={() => {
              closeMenu();
              onRegisterClick();
            }}
          >
            Get started
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
