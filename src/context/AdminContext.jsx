import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(
    localStorage.getItem("role")
  );

  const login = (email, password) => {
  // 🔐 ADMIN LOGIN
  if (email === "admin@zora.com" && password === "admin123") {
    setRole("admin");
    localStorage.setItem("role", "admin");
    return "admin";
  }

  // 👤 USER LOGIN
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    setRole("user");
    localStorage.setItem("role", "user");
    localStorage.setItem("loggedUser", JSON.stringify(user));
    return "user";
  }

  return null; // ❌ invalid login
};

  const logout = () => {
    setRole(null);
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
