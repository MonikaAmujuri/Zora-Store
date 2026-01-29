import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // reuse same styles

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ❌ Prevent duplicate email
    if (users.find((u) => u.email === email)) {
      setError("User already exists");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password
    };

    localStorage.setItem(
      "users",
      JSON.stringify([...users, newUser])
    );

    navigate("/login");
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>

        <p className="switch-auth">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
