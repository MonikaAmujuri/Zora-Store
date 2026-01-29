import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AdminContext";
import "./Profile.css";

function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("loggedUser"));

  const [name, setName] = useState(storedUser?.name || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((u) =>
      u.email === storedUser.email
        ? { ...u, name, password: password || u.password }
        : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "loggedUser",
      JSON.stringify({ ...storedUser, name })
    );

    setMessage("Profile updated successfully");
    setPassword("");
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>My Profile</h2>

        {message && <p className="success">{message}</p>}

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input type="email" value={storedUser.email} disabled />

        <label>New Password</label>
        <input
          type="password"
          placeholder="Leave blank to keep current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>

        <button
          className="logout-btn"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
