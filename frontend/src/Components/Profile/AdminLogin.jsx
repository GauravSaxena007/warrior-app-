import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/adminlogin`,{
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage:', token);       // Store token in localStorage (port 5173)
      localStorage.setItem('user', JSON.stringify(user));

      alert('Login successful!');
      // Redirect to admin panel with token in URL
      window.location.href = `${import.meta.env.VITE_ADMIN_URL}/dashboard?token=${encodeURIComponent(token)}`;
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">⚙️ Admin Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <h3 className="login-header">Login to Admin Dashboard</h3>
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
          <button type="submit" className="login-btn">🔐 Submit</button>
          <button onClick={() => navigate('/')} className="login-home-btn">
          🏠 Back To Homepage
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;