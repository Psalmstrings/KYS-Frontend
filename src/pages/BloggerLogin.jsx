import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaFeatherAlt, FaArrowLeft } from "react-icons/fa";
import nansLogo from "../assets/download__4_-removebg-preview.png";
import "../styles/blogStyles.css";

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";

const BloggerLogin = () => {
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
      const { data } = await axios.post(`${API_URL}/auth/blogger/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      // Save token across local keys
      localStorage.setItem("token", data.token);
      localStorage.setItem("blogger_token", data.token);
      if (data.blogger?.role) {
        localStorage.setItem("role", data.blogger.role);
      }
      if (data.blogger) {
        localStorage.setItem("blogger_user", JSON.stringify(data.blogger));
      }

      toast.success("Login successful! Welcome to Blogger Dashboard");
      navigate("/blog/profile");
    } catch (err) {
      console.error("Blogger login error:", err);
      const message = err.response?.data?.message || "Authentication failed. Please verify your email and password.";
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
            <FaFeatherAlt /> Media & Press Contributor
          </span>
          <h1 className="login-title">Blogger Dashboard</h1>
          <p className="login-subtitle">
            Sign in to submit press releases, manage your news stories, and coordinate student media outreach.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Contributor Email</label>
            <div className="input-field-wrap">
              <FaEnvelope className="field-icon" />
              <input
                type="email"
                placeholder="blogger@officeoftheprozoned.com"
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
            {loading ? "Authenticating..." : "Sign In to Blogger Panel"}
          </button>
        </form>

        {/* Register Prompt */}
        <div className="login-switch-action">
          <span>New media aide or press contributor? </span>
          <Link to="/blogger/signup" className="switch-action-link">
            Register Account
          </Link>
        </div>

        {/* Portal Switcher & Website Link */}
        <div className="login-links-strip">
          <Link to="/blogadmin/login" className="portal-switch-link">
            Central CMS Admin →
          </Link>
          <span className="dot-divider">•</span>
          <Link to="/login" className="portal-switch-link">
            KYS Student Admin →
          </Link>
        </div>

        <div className="back-website-row">
          <Link to="/" className="back-website-link">
            <FaArrowLeft /> Back to Official Website
          </Link>
        </div>

        <p className="login-footer">
          &copy; {new Date().getFullYear()} Office of the PRO — NANS Southwest Zone D.
          <br />Press & Media Contributor Operations.
        </p>
      </div>
    </div>
  );
};

export default BloggerLogin;
