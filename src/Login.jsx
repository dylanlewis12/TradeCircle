import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AuthContext); // Access login function
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Check if password is shorter than 8 characters
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Check if email contains an '@' symbol
    if (!email.includes("@") || email.length < 8) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });

      // Extract tokens and user data from response
      const { access, refresh } = response.data;

      // Pass user data and tokens to context
      login({ email }, access, refresh); // Store access and refresh tokens
      localStorage.setItem("email", email);

      alert("Do you consent to your information being stored?");
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="left-panel">
        <img src="/bam.png" alt="Login Illustration" className="bam-image" />
        <div className="divider" />
      </div>

      {/* Right Side */}
      <div className="right-panel">
        <form className="login-form" onSubmit={handleLogin}>
          <h2 className="login-title">Welcome to TradeCircle</h2>

          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Trade Circle"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              required
            />
            <div className="forgot-link">
              <a href="/forgot-password">Forgot Password?</a>
            </div>
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Sign in"}
          </button>
          <p className="register-text">
            Don’t have an account?{" "}
            <span className="register-link" onClick={handleRegisterClick}>
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
