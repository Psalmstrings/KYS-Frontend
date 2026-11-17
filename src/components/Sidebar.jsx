import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaNewspaper, 
  FaPlusCircle, 
  FaUsersCog, 
  FaUserGraduate, 
  FaGlobe,
  FaSignOutAlt
} from "react-icons/fa";
import { toast } from "sonner";
import "../styles/admindash.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pro_admin_token");
    localStorage.removeItem("kys_token");
    localStorage.removeItem("role");
    localStorage.removeItem("admin_name");
    toast.success("Signed out of Central Admin CMS");
    navigate("/blogadmin/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>CENTRAL CMS</h2>
        <span>Office of the PRO Zone D</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/blog/admin" end className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
          <FaTachometerAlt /> Overview & CMS
        </NavLink>

        <NavLink to="/admin/news" className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
          <FaNewspaper /> News Management
        </NavLink>

        <NavLink to="/create-news" className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
          <FaPlusCircle /> Publish News
        </NavLink>

        <NavLink to="/blog/admin/bloggers" className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
          <FaUsersCog /> Blogger Team
        </NavLink>

        <div className="sidebar-divider"></div>

        <NavLink to="/blog/admin?tab=kys" className="sidebar-link portal-link">
          <FaUserGraduate /> KYS Student Records →
        </NavLink>

        <a href="/" target="_blank" rel="noopener noreferrer" className="sidebar-link site-link">
          <FaGlobe /> View Live Website ↗
        </a>

        <button onClick={handleSignOut} className="sidebar-link signout-sidebar-btn" style={{ background: "none", border: "none", width: "100%", cursor: "pointer", textAlign: "left", color: "#f87171" }}>
          <FaSignOutAlt /> Sign Out CMS
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
