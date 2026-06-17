import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  if (!username || !role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If user doesn't have permissions, redirect to their dashboard
    if (role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (role === "faculty") {
      return <Navigate to="/faculty-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
