import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../index.css"; // Ensure global styles are applied

const BlogAdminDashboard = () => (
  <div className="admin-container">
    <Sidebar />
    <div className="main-cont">
      <Navbar />
      <Outlet />
    </div>
  </div>
);

export default BlogAdminDashboard;