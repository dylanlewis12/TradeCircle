import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Login.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!email.includes("@") || email.length < 8) {
      setError("Please enter a valid email");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Reset error message
    setError("");

    console.log("Signing up with:", { email, username, password });

    try {
      // Call the backend to check credentials using POST
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        email,

        username,
        password,
      });

      // Store tokens in localStorage
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("email", email);
      navigate("/home");
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage =
        error.response?.data?.detail ||
        "Invalid credentials. Please try again.";
      setError(errorMessage);
    }
  };

  const handleLogin = () => {
    navigate("/");
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
        <form className="login-form" onSubmit={handleRegister}>
          <h2 className="login-title">Create an Account</h2>

          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-underline"
              placeholder="Type something"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-underline"
              placeholder="Type something"
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
              className="input-underline"
              placeholder="Type something"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-underline"
              placeholder="Type something"
              required
            />
          </div>

          <button className="login-button" type="submit">
            Sign Up
          </button>

          <p className="register-text">
            Already have an account?{" "}
            <span className="register-link" onClick={handleLogin}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
