import React from "react";
import { Navigate } from "react-router-dom";

// Protected Route for KYC / Student Admin Portal
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("kys_token") || localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
