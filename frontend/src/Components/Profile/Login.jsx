import React from "react";
import "./Login.css"; // Import CSS file

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">⚙️ Login</h2>
        <div className="login-form">
          <h3 className="login-header">Login!</h3>
          <input type="email" placeholder="E-mail" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
          <button className="login-btn">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
