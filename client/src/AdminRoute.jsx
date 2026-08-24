import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const userRole = localStorage.getItem("userRole");

  if (userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;