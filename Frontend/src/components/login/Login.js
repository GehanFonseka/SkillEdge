import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import { jwtDecode } from "jwt-decode";// To decode JWT token
import axios from "../../api/axiosConfig"; // Use the configured Axios instance
import "./Login.css";

const GOOGLE_CLIENT_ID =
  "147306522332-au6tlle7fkcg2nsft0vqljglkminc2cs.apps.googleusercontent.com";

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
      localStorage.setItem("token", token);

      // Fetch user profile after login
      const response = await axios.get("/api/v1/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data;

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      setAuthToken(token);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  const handleGoogleLoginSuccess = (response) => {
    const token = response.credential;
    const decodedUser = jwtDecode(token); // Decode Google JWT

    console.log("Google User Info:", decodedUser);

    // Create a user object with a username field
    const user = {
      username: decodedUser.name || decodedUser.email, // Use name or email as username
      picture: decodedUser.picture, // Profile picture
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthToken(token);
    navigate("/");
  };

  const handleFacebookLoginSuccess = (response) => {
    const token = response.accessToken;
    localStorage.setItem("token", token);
    setAuthToken(token);
    navigate("/");
  };

  const handleSocialLoginFailure = () => {
    setError("Social login failed. Please try again.");
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
          <button type="submit" className="login-btn">
            Login
          </button>
          <p className="register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>

        {/* Social Login */}
        <div className="social-login">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleSocialLoginFailure}
            />
          </GoogleOAuthProvider>

          <FacebookLogin
            appId="YOUR_FACEBOOK_APP_ID"
            autoLoad={false}
            fields="name,email,picture"
            callback={handleFacebookLoginSuccess}
            onFailure={handleSocialLoginFailure}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;