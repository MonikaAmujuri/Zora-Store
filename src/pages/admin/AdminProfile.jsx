import { useAuth } from "../../context/AdminContext";
import "./AdminProfile.css";

function AdminProfile() {
  const { logout } = useAuth();

  return (
    <div className="admin-profile-page">
      <h1 className="profile-title">Admin Profile</h1>

      <div className="profile-card">
        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="avatar">A</div>
          <div>
            <h2>Admin</h2>
            <span className="role-badge">Administrator</span>
          </div>
        </div>

        {/* PROFILE INFO */}
        <div className="profile-info">
          <div className="info-row">
            <label>Email</label>
            <span>admin@zora.com</span>
          </div>

          <div className="info-row">
            <label>Role</label>
            <span>Full Access</span>
          </div>
        </div>

        {/* PASSWORD SECTION */}
        <div className="password-section">
          <h3>Change Password</h3>

          <input type="password" placeholder="Current password" />
          <input type="password" placeholder="New password" />
          <input type="password" placeholder="Confirm new password" />

          <button className="update-btn" disabled>
            Update Password
          </button>

          <small className="note">
            Password update UI only (backend not connected)
          </small>
        </div>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminProfile;
