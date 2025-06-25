import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // ✅ Load remembered email on mount (for autofill only)
  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Try admin login
      let res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data = await res.json();

      if (res.ok) {
        // ✅ Save email only if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // ✅ Always store token in localStorage/sessionStorage (your logic here)
        localStorage.setItem("token", data.token); // or sessionStorage.setItem("token", ...)
        navigate("/franchprofile");
        return;
      }

      // Try franchisee login
      res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/franchisee-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      data = await res.json();

      if (res.ok) {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        localStorage.setItem("token", data.token); // or sessionStorage.setItem("token", ...)
        navigate("/franchprofile");
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
        <img
          src="/logo-name.png"
          alt="Logo-login"
          style={{ width: '300px' }}
        />
        <form className="login-form" onSubmit={handleLogin} autoComplete="on">
          <h3 className="login-header">Login!</h3>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="E-mail"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label style={{ color: 'black', display: 'flex', alignItems: 'center', marginTop: '3px', marginBottom: '7px' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Remember Me
          </label>
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
