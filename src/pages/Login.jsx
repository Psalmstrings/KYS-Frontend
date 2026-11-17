import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserGraduate, FaArrowLeft } from "react-icons/fa";
import nansLogo from "../assets/download__4_-removebg-preview.png";
import "../styles/blogStyles.css";

const API_URL = import.meta.env.VITE_API_URL || "https://kys-backend.onrender.com";

const AdminLogin = () => {
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
      const { data } = await axios.post(`${API_URL}/api/admin/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("kys_token", data.token);
      localStorage.setItem("pro_admin_token", data.token);
      localStorage.setItem("kys_user", JSON.stringify(data.admin));

      toast.success("Login successful! Welcome to KYS Admin Portal");
      navigate("/admin");
    } catch (err) {
      console.error("KYS login error:", err);
      const message = err.response?.data?.msg || err.response?.data?.message || err.message || "Authentication failed. Please verify your credentials.";
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
          <span className="login-badge-pill kys-badge">
            <FaUserGraduate /> KYS Student Portal Admin
          </span>
          <h1 className="login-title">KYS Admin Portal</h1>
          <p className="login-subtitle">
            Secure verification, identification, and record management for students across Southwest Zone D institutions.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Admin Email</label>
            <div className="input-field-wrap">
              <FaEnvelope className="field-icon" />
              <input
                type="email"
                placeholder="kysadmin@officeoftheprozoned.com"
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
                placeholder="Enter password"
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
            {loading ? "Authenticating..." : "Sign In to KYS Admin"}
          </button>
        </form>

        {/* Portal Switcher & Website Link */}
        <div className="login-links-strip">
          <Link to="/blogadmin/login" className="portal-switch-link">
            Central CMS Admin →
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
          <br />Know Your Student (KYS) Platform Administration.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
