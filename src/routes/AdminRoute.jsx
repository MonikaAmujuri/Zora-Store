import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AdminContext";

function AdminRoute({ children }) {
  const { role } = useAuth();

  // 🔐 fallback for page refresh / redirect timing
  const storedRole = role || localStorage.getItem("role");

  if (storedRole !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
