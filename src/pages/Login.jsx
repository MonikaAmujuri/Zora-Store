import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { useAuth } from "../context/AdminContext";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const userRole = login(email, password);

        if (!userRole) {
            setError("Invalid credentials");
            return;
        }

        if (userRole === "admin") {
            navigate("/admin/dashboard", { replace: true });
        } else {
            navigate("/", { replace: true });
        }
    };



    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1 className="brand">ZORA</h1>
                <p className="subtitle">Welcome back 👋</p>

                <h2>Login</h2>

                {error && <p className="error">{error}</p>}

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
                <p className="forgot-link">
                    <Link to="/forgot-password">Forgot password?</Link>
                </p>


                <button type="submit">Login</button>
                <p className="switch-auth">
                    Don’t have an account? <Link to="/signup">Sign up</Link>
                </p>

            </form>
        </div>
    );
}

export default Login;
