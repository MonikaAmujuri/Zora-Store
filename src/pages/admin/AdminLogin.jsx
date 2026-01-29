import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AdminContext";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    const success = adminLogin(email, password);

    if (success) {
      navigate("/admin/dashboard"); 
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <h2>Admin Login</h2>

        <input
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default AdminLogin;
