import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaFeatherAlt, FaArrowLeft } from "react-icons/fa";
import nansLogo from "../assets/download__4_-removebg-preview.png";
import "../styles/blogStyles.css";

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";

const BloggerSignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/blogger/register`, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success("Account registered successfully! You can now sign in.");
      navigate("/blogger/login");
    } catch (err) {
      console.error("Blogger signup error:", err);
      const message = err.response?.data?.message || "Registration failed. Please check your details.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Header Branding */}
        <div className="login-header-branding">
          <Link to="/">
            <img src={nansLogo} alt="NANS Zone D Logo" className="login-logo-img" />
          </Link>
          <span className="login-badge-pill blogger-badge">
            <FaFeatherAlt /> Press & Media Contributor
          </span>
          <h1 className="login-title">Join Media Team</h1>
          <p className="login-subtitle">
            Create an account to submit news, campus reports, and press releases for the official portal.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Full Name *</label>
            <div className="input-field-wrap">
              <FaUser className="field-icon" />
              <input
                type="text"
                placeholder="e.g. Comrade Samuel Adeleke"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address *</label>
            <div className="input-field-wrap">
              <FaEnvelope className="field-icon" />
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password *</label>
            <div className="input-field-wrap">
              <FaLock className="field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password *</label>
            <div className="input-field-wrap">
              <FaLock className="field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Register Contributor Account"}
          </button>
        </form>

        {/* Login Prompt */}
        <div className="login-switch-action">
          <span>Already registered? </span>
          <Link to="/blogger/login" className="switch-action-link">
            Sign In Here
          </Link>
        </div>

        <div className="back-website-row">
          <Link to="/" className="back-website-link">
            <FaArrowLeft /> Back to Official Website
          </Link>
        </div>

        <p className="login-footer">
          &copy; {new Date().getFullYear()} Office of the PRO — NANS Southwest Zone D.
        </p>
      </div>
    </div>
  );
};

export default BloggerSignUp;
