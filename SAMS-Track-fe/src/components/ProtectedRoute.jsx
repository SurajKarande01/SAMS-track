import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  if (!username || !role) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is allowed (Super Admin automatically satisfies Admin permissions)
  const isAllowed = allowedRoles && (
    allowedRoles.includes(role) || 
    (role === "superadmin" && allowedRoles.includes("admin"))
  );

  if (allowedRoles && !isAllowed) {
    // If user doesn't have permissions, redirect to their dashboard
    if (role === "admin" || role === "superadmin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (role === "faculty") {
      return <Navigate to="/faculty-dashboard" replace />;
    } else if (role === "student" || role === "parent") {
      return <Navigate to="/student-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
