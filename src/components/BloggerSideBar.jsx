import React from "react";
import { NavLink } from "react-router-dom";
import "../index.css"; // Ensure global styles are applied

const Sidebar = () => (
  <div className="sidebar">
    <h2>Blogger Panel</h2>
    <nav>
      <NavLink to="/blog/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
      <NavLink to="/create/news" className={({ isActive }) => isActive ? "active" : ""}>Create News</NavLink>
      <NavLink to="/news-management" className={({ isActive }) => isActive ? "active" : ""}>News Management</NavLink>
    </nav>
  </div>
);

export default Sidebar;