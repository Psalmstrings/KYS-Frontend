import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import "../index.css";

const Navbar = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("admin_name") || "Administrator";
  const role = localStorage.getItem("role") || "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pro_admin_token");
    localStorage.removeItem("role");
    localStorage.removeItem("admin_name");
    toast.success("Signed out of Central Admin");
    navigate("/blogadmin/login");
  };

  return (
    <div className="navbarr">
      <div className="admin-status-badge">
        <FaShieldAlt style={{ color: "#166534" }} />
        <span>Central Admin • {adminName} ({role.toUpperCase()})</span>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> Sign Out
      </button>
    </div>
  );
};

export default Navbar;
