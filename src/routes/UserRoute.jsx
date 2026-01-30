import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AdminContext";

function UserRoute({ children }) {
  const { role } = useAuth();
  const location = useLocation();

  // ❌ Not logged in
  if (!role) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ❌ Admin should not checkout
  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ Logged-in user
  return children;
}

export default UserRoute;
