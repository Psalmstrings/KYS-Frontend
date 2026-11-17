import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaPlusCircle, FaNewspaper, FaGlobe, FaSignOutAlt } from "react-icons/fa";
import { toast } from "sonner";
import "../styles/admindash.css";

const BloggerSideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("blogger_token");
    localStorage.removeItem("blogger_user");
    localStorage.removeItem("role");
    toast.success("Signed out of Blogger Panel");
    navigate("/blogger/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>BLOGGER PORTAL</h2>
        <span>Press & Media Team</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/blog/profile" 
          end 
          className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
        >
          <FaUserCircle /> My Contributor Profile
        </NavLink>

        <NavLink 
          to="/create/news" 
          className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
        >
          <FaPlusCircle /> Submit New Story
        </NavLink>

        <NavLink 
          to="/news-management" 
          className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
        >
          <FaNewspaper /> Manage My Articles
        </NavLink>

        <div className="sidebar-divider"></div>

        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="sidebar-link site-link"
        >
          <FaGlobe /> View Live Website ↗
        </a>

        <button onClick={handleLogout} className="sidebar-link signout-sidebar-btn">
          <FaSignOutAlt /> Sign Out
        </button>
      </nav>
    </div>
  );
};

export default BloggerSideBar;
