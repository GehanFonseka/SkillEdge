import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";


const Login = ({ setAuthToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = await loginUser({ username, password });
      localStorage.setItem("token", token); // Store JWT token in localStorage
      setAuthToken(token);
      navigate("/"); // Redirect to home page
    } catch (err) {
      setError("Invalid username or password.");
    }
  };


  return (
    <div className="auth-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="sub-text">Please login to your account</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
          {error && <p className="error-message">{error}</p>}
          <p className="register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Login;
