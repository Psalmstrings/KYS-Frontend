import React from "react";
import { Navigate } from "react-router-dom";

// Protected Route for Blog Admin / Central CMS
export const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("pro_admin_token") || localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/blogadmin/login" replace />;
  }

  return children;
};

// Protected Route for Blogger
export const ProtectedBloggerRoute = ({ children }) => {
  const token = localStorage.getItem("blogger_token") || localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/blogger/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
