import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // reuse same styles

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find((u) => u.email === email);

    if (!userExists) {
      setError("No account found with this email");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((u) =>
      u.email === email ? { ...u, password: newPassword } : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Password reset successfully");
    navigate("/login");
  };

  return (
    <div className="login-page">
      <form
        className="login-card"
        onSubmit={step === 1 ? handleEmailSubmit : handleResetPassword}
      >
        <h2>Forgot Password</h2>

        {error && <p className="error">{error}</p>}

        {step === 1 ? (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Continue</button>
          </>
        ) : (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </>
        )}

        <p className="switch-auth">
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
