import React, { useState } from "react";
import "../index.css";
import nansLogo from "../assets/download__4_-removebg-preview.png";

const Navbarr = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={nansLogo} alt="NANS Logo" />
          <span>PRO ZONE-D</span>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><a href="/" onClick={toggleMenu}>Home</a></li>
          <li><a href="/about-us" onClick={toggleMenu}>About Us</a></li>
          <li><a href="/headlines" onClick={toggleMenu}>News</a></li>
          <li><a href="#media" onClick={toggleMenu}>Media</a></li>
          <li><a href="#contact" onClick={toggleMenu}>Contact Us</a></li>
        </ul>

        {/* Hamburger Menu */}
        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbarr;