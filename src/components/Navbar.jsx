import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaSignOutAlt, FaShieldAlt, FaExternalLinkAlt, FaUserCircle } from "react-icons/fa";
import nansLogo from "../assets/download__4_-removebg-preview.png";
import "../styles/adminDashboard.css";

const Navbar = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("admin_name") || "Abimbola Samuel";
  const role = localStorage.getItem("role") || "Central Administrator";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pro_admin_token");
    localStorage.removeItem("kys_token");
    localStorage.removeItem("role");
    localStorage.removeItem("admin_name");
    toast.success("Signed out of Central Admin");
    navigate("/blogadmin/login");
  };

  return (
    <header className="admin-global-navbar">
      <div className="admin-nav-left">
        <Link to="/blog/admin" className="admin-nav-brand">
          <img src={nansLogo} alt="NANS Crest" className="admin-nav-logo" />
          <div className="admin-nav-titles">
            <span className="admin-nav-title">NANS SOUTHWEST ZONE D</span>
            <span className="admin-nav-subtitle">Office of the PRO • Central Administration</span>
          </div>
        </Link>
      </div>

      <div className="admin-nav-right">
        <div className="admin-session-pill">
          <div className="admin-pulse-dot"></div>
          <FaShieldAlt className="admin-badge-icon" />
          <span className="admin-session-text">
            <strong>{adminName}</strong> ({role})
          </span>
        </div>

        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="admin-nav-action-link"
          title="Open live public website in new tab"
        >
          <FaExternalLinkAlt /> <span>View Website</span>
        </a>

        <button 
          className="admin-nav-logout-btn" 
          onClick={handleLogout}
          title="Sign out of administrative session"
        >
          <FaSignOutAlt /> <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
