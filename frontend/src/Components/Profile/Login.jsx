import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Try admin login first
      let res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/franchprofile"); // Redirect to admin dashboard
        return;
      }

      // If admin login fails, try franchisee login
      res = await fetch(`${import.meta.env.VITE_API_URL}/auth/franchisee-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/franchprofile"); // Redirect to franchisee profile
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      
      <div className="login-box">
        <h2 className="login-title">⚙️ Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <h3 className="login-header">Login!</h3>
          <input
            type="email"
            placeholder="E-mail"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">✅ Submit</button>
          <button onClick={() => window.location.href = '/'} className="login-home-btn">
          🏠 Back To Homepage
</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
