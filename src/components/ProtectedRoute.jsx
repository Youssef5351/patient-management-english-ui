import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, role, requiredRole, children }) => {
  if (!isAuthenticated || role !== requiredRole) {
    // Redirect to login if not authenticated or role mismatch
    return <Navigate to="/login" replace />;
  }

  // Render child components if authorized
  return children;
};

export default ProtectedRoute;
