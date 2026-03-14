// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtecteddRoute = ({ children }) => {
  const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role",);

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/blogger/login" replace />;
  }

  // If token exists, render the page
  return children;
};

export default ProtecteddRoute;
