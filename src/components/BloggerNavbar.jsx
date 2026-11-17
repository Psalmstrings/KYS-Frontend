import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import "../styles/admindash.css";

const BloggerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("blogger_token");
    localStorage.removeItem("blogger_user");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/blogger/login");
  };

  return (
    <div className="admin-top-nav">
      <div className="nav-brand">
        <h2>Media & Press Contributor Panel</h2>
        <span>Office of the PRO • NANS Southwest Zone D</span>
      </div>

      <div className="nav-right-actions">
        <Link to="/blogadmin/login" className="switch-portal-btn">
          <FaShieldAlt /> Central CMS Admin →
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default BloggerNavbar;
