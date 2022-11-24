import React from "react";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/administrator/login" />;
}

export function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  return !token ? children : <Navigate to="/administrator/dashboard" />;
}
