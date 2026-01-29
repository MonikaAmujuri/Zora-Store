import { useEffect, useState } from "react";
import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const loggedInUsers = users.filter(u => u.isLoggedIn);

  return (
    <div className="admin-page">
      <h1>Users</h1>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <p>Total Users</p>
          <h2>{users.length}</h2>
        </div>

        <div className="stat-card green">
          <p>Logged In Users</p>
          <h2>{loggedInUsers.length}</h2>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="admin-card">
        <h3>Users List</h3>

        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>
                    {user.isLoggedIn ? (
                      <span className="status-badge success">
                        Logged In
                      </span>
                    ) : (
                      <span className="status-badge danger">
                        Logged Out
                      </span>
                    )}
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
