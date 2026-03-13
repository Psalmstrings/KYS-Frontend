import React from "react";
import { NavLink } from "react-router-dom";
import "../index.css"; // Ensure global styles are applied

const Sidebar = () => (
  <div className="sidebar">
    <h2>Admin Panel</h2>
    <nav>
      <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
      <NavLink to="/admin/news" className={({ isActive }) => isActive ? "active" : ""}>News Management</NavLink>
      <NavLink to="/blog/admin/bloggers" className={({ isActive }) => isActive ? "active" : ""}>Blogger Management</NavLink>
    </nav>
  </div>
);

export default Sidebar;