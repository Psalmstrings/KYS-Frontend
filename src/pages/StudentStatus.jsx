import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import Navbarr from "../components/Navbarr";
import { FaSearch, FaCheckCircle, FaClock, FaTimesCircle, FaIdCard, FaPrint, FaArrowLeft } from "react-icons/fa";
import "../index.css";
import "../styles/kysPortal.css";

const StudentStatus = () => {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentResult, setStudentResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "https://kys-backend.onrender.com";

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error("Please enter your Registration ID, Email, or Phone number.");
      return;
    }

    setLoading(true);
    setSearched(true);
    setErrorMsg("");
    setStudentResult(null);

    try {
      const res = await fetch(`${API_URL}/api/students/verify-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setStudentResult(data.student);
        toast.success("Registration record located!");
      } else {
        setErrorMsg(data.msg || "No student record found. Please verify your details.");
      }
    } catch (err) {
      console.error("Status lookup error:", err);
      setErrorMsg("Unable to communicate with the verification server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Verified":
        return <span className="status-badge verified"><FaCheckCircle /> Verified Record</span>;
      case "Rejected":
        return <span className="status-badge rejected"><FaTimesCircle /> Verification Rejected</span>;
      default:
        return <span className="status-badge pending"><FaClock /> Pending Review</span>;
    }
  };

  return (
    <div className="kys-status-page">
      <Helmet>
        <title>Student Verification Status | KYS - NANS Southwest Zone D</title>
        <meta
          name="description"
          content="Check and verify your NANS Southwest Zone D student registration status using your KYS Registration ID, Email, or Phone number."
        />
        <link rel="canonical" href="https://officeoftheprozoned.com/verify-status" />
      </Helmet>

      <Navbarr />

      <main className="container status-page-main">
        <div className="status-header-box">
          <span className="badge-tag">Verification Check</span>
          <h1>KYS Registration Status Verification</h1>
          <p>
            Enter your <strong>Registration ID (e.g. KYS-ZD-2026-XXXXXX)</strong>, registered email address, or phone number to check your verification record.
          </p>

          <form onSubmit={handleLookup} className="status-search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Registration ID, Email, or Phone Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <button type="submit" className="search-btn" disabled={loading}>
                {loading ? "Searching..." : <><FaSearch /> Check Status</>}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Querying zonal verification registry...</p>
          </div>
        )}

        {searched && !loading && errorMsg && (
          <div className="status-error-card">
            <h3>Record Not Found</h3>
            <p>{errorMsg}</p>
            <p className="status-hint">
              If you have not registered yet, you can register now on the KYS Portal.
            </p>
            <Link to="/register" className="primary-btn">
              Proceed to KYS Registration
            </Link>
          </div>
        )}

        {studentResult && (
          <div className="student-status-result-card">
            <div className="result-header">
              <div className="result-badge-col">
                <span className="reg-id-pill">{studentResult.registrationId}</span>
                {getStatusBadge(studentResult.verificationStatus)}
              </div>
              <h2 className="result-student-name">{studentResult.fullName}</h2>
              <p className="result-student-inst">{studentResult.institution}</p>
            </div>

            <div className="result-body-grid">
              <div className="result-item">
                <span className="r-label">Course of Study</span>
                <span className="r-val">{studentResult.course}</span>
              </div>
              <div className="result-item">
                <span className="r-label">Academic Level</span>
                <span className="r-val">{studentResult.level} Level</span>
              </div>
              <div className="result-item">
                <span className="r-label">State of Origin</span>
                <span className="r-val">{studentResult.stateOrigin} State</span>
              </div>
              <div className="result-item">
                <span className="r-label">Registered On</span>
                <span className="r-val">
                  {new Date(studentResult.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="result-action-box">
              <button onClick={() => window.print()} className="print-slip-btn">
                <FaPrint /> Print Official Verification Record
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} NANS SOUTHWEST — Office of the Public Relations Officer.</p>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about-us">About Us</Link>
            <Link to="/register">KYS Portal</Link>
            <Link to="/headlines">News</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentStatus;
