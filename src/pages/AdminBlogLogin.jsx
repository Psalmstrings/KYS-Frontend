import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaArrowLeft, FaGlobe } from "react-icons/fa";
import nansLogo from "../assets/download__4_-removebg-preview.png";
import "../styles/blogStyles.css";

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";

const AdminBlogLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/auth/admin/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      // Save credentials across tokens for seamless interoperability
      localStorage.setItem("token", data.token);
      localStorage.setItem("pro_admin_token", data.token);
      localStorage.setItem("kys_token", data.token);
      localStorage.setItem("role", data.admin?.role || "admin");
      localStorage.setItem("admin_name", data.admin?.name || "Administrator");

      toast.success("Login successful! Welcome to Central Admin CMS");
      navigate("/blog/admin");
    } catch (err) {
      console.error("Admin login error:", err);
      const message = err.response?.data?.message || err.response?.data?.error || "Authentication failed. Please verify your credentials.";
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
          <span className="login-badge-pill">
            <FaShieldAlt /> Central Administrator
          </span>
          <h1 className="login-title">Central Admin CMS</h1>
          <p className="login-subtitle">
            Sign in to manage live website content, executive leadership, press releases, and student inquiries.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Administrator Email</label>
            <div className="input-field-wrap">
              <FaEnvelope className="field-icon" />
              <input
                type="email"
                placeholder="admin@officeoftheprozoned.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-field-wrap">
              <FaLock className="field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Central CMS"}
          </button>
        </form>

        {/* Portal Switcher & Website Link */}
        <div className="login-links-strip">
          <Link to="/login" className="portal-switch-link">
            KYS Student Admin →
          </Link>
          <span className="dot-divider">•</span>
          <Link to="/blogger/login" className="portal-switch-link">
            Blogger Sign In →
          </Link>
        </div>

        <div className="back-website-row">
          <Link to="/" className="back-website-link">
            <FaArrowLeft /> Back to Official Website
          </Link>
        </div>

        <p className="login-footer">
          &copy; {new Date().getFullYear()} Office of the PRO — NANS Southwest Zone D.
          <br />Official Administrative Information Management System.
        </p>
      </div>
    </div>
  );
};

export default AdminBlogLogin;
