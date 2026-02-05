import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminHeader.css";

function AdminHeader({ title = "Admin Dashboard" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="admin-header">
      <h2>{title}</h2>

      <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
    </header>
  );
}

export default AdminHeader;
