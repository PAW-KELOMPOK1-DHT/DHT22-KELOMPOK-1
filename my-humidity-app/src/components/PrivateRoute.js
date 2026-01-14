import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // ambil role dari login

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    // jika role tidak termasuk, redirect ke dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
