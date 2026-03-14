import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../index.css"; // Ensure global styles are applied

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/blogger/login");
  };

  return (
    <div className="navbarr">
      <h3>Blogger Dashboard</h3>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Navbar;