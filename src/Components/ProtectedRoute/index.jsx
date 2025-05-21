"use client";

import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");

  if (!isAuthenticated && !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};
