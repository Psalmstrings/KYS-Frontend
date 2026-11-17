import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFeatherAlt, FaArrowLeft, FaShieldAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import nansLogo from "../assets/download__4_-removebg-preview.png";
import "../styles/blogStyles.css";

const BloggerSignUp = () => {
  const navigate = useNavigate();
  const isAdmin = Boolean(localStorage.getItem("pro_admin_token"));

  return (
    <div className="login-wrapper">
      <div className="login-card" style={{ maxWidth: "480px" }}>
        {/* Header Branding */}
        <div className="login-header-branding">
          <Link to="/">
            <img src={nansLogo} alt="NANS Zone D Logo" className="login-logo-img" />
          </Link>
          <span className="login-badge-pill blogger-badge">
            <FaShieldAlt /> Media Team Policy
          </span>
          <h1 className="login-title">Restricted Contributor Portal</h1>
          <p className="login-subtitle">
            Blogger and press accounts are provisioned exclusively by the Central Administration of the Office of the PRO. Public self-registration is disabled for editorial security.
          </p>
        </div>

        <div style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px",
          textAlign: "left",
          fontSize: "0.92rem",
          color: "#166534",
          lineHeight: "1.6"
        }}>
          <strong>Notice to Campus Reporters & Media Aides:</strong>
          <p style={{ marginTop: "6px", marginBottm: "0" }}>
            To obtain contributor credentials for publishing press releases and reports, please submit your editorial credentials to the Central Administration via the official secretariat contact or email: <code style={{ color: "#15803d" }}>office@officeoftheprozoned.com</code>.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => navigate("/blog/admin?tab=bloggers")}
            className="login-submit-btn"
            style={{ marginBottom: "12px" }}
          >
            <FaUserPlus style={{ marginRight: "8px" }} /> Create Blogger in Central CMS →
          </button>
        ) : (
          <button
            onClick={() => navigate("/blogger/login")}
            className="login-submit-btn"
            style={{ marginBottom: "12px" }}
          >
            <FaSignInAlt style={{ marginRight: "8px" }} /> Proceed to Blogger Sign In →
          </button>
        )}

        <div className="login-footer-links" style={{ justifyContent: "center" }}>
          <Link to="/" className="back-link">
            <FaArrowLeft /> Return to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BloggerSignUp;
