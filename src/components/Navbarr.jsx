import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "../index.css";
import nansLogo from "../assets/download__4_-removebg-preview.png";

const Navbarr = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={nansLogo} alt="NANS Logo" />
          <div className="logo-text">
            <span className="logo-title">NANS SOUTHWEST</span>
            <span className="logo-sub">Office of the PRO • Zone D</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about-us" onClick={closeMenu} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              About & Leadership
            </NavLink>
          </li>
          <li>
            <NavLink to="/headlines" onClick={closeMenu} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              News
            </NavLink>
          </li>
          <li>
            <NavLink to="/register" onClick={closeMenu} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              KYS Portal
            </NavLink>
          </li>
          <li>
            <NavLink to="/verify-status" onClick={closeMenu} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Verify Status
            </NavLink>
          </li>
          <li>
            <a href="/#contact" onClick={closeMenu} className="nav-link">
              Contact
            </a>
          </li>
          <li className="nav-cta-item">
            <Link to="/register" onClick={closeMenu} className="nav-cta-btn">
              Register KYS
            </Link>
          </li>
        </ul>

        {/* Hamburger Menu */}
        <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu} aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbarr;
