import React from "react";
import { FaPrint, FaCheckCircle, FaIdCard, FaUniversity } from "react-icons/fa";
import nansLogo from "../assets/download__4_-removebg-preview.png";

const StudentCard = ({ student, onReset }) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="student-verification-container">
      <div className="success-banner-box">
        <FaCheckCircle className="success-check-icon" />
        <h2>Registration Successful!</h2>
        <p>You are officially registered in the NANS Southwest Zone D Student Database.</p>
      </div>

      <div className="printable-id-card" id="student-slip">
        {/* Card Header */}
        <div className="card-top-header">
          <img src={nansLogo} alt="NANS Logo" className="card-logo" />
          <div className="card-header-titles">
            <h3>NATIONAL ASSOCIATION OF NIGERIAN STUDENTS</h3>
            <h4>SOUTHWEST ZONE D (OFFICE OF THE PRO)</h4>
            <span className="slip-badge">KNOW YOUR STUDENT (KYS) REGISTRATION SLIP</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-inner-body">
          <div className="reg-number-banner">
            <span className="reg-label">STUDENT REGISTRATION ID:</span>
            <span className="reg-id-val">{student.registrationId || "KYS-ZD-PENDING"}</span>
            <span className="reg-status-badge verified">Status: Registered / Pending Verification</span>
          </div>

          <div className="student-details-grid">
            <div className="detail-item">
              <span className="d-label">FULL NAME</span>
              <span className="d-val">{student.fullName}</span>
            </div>

            <div className="detail-item">
              <span className="d-label">INSTITUTION</span>
              <span className="d-val">{student.institution}</span>
            </div>

            <div className="detail-item">
              <span className="d-label">COURSE OF STUDY</span>
              <span className="d-val">{student.course}</span>
            </div>

            <div className="detail-item">
              <span className="d-label">ACADEMIC LEVEL</span>
              <span className="d-val">{student.level} Level</span>
            </div>

            <div className="detail-item">
              <span className="d-label">STATE OF ORIGIN</span>
              <span className="d-val">{student.stateOrigin}</span>
            </div>

            <div className="detail-item">
              <span className="d-label">LOCAL GOVT. AREA</span>
              <span className="d-val">{student.lgaOrigin}</span>
            </div>

            <div className="detail-item">
              <span className="d-label">EMAIL ADDRESS</span>
              <span className="d-val">{student.email}</span>
            </div>

            <div className="detail-item">
              <span className="d-label">PHONE NUMBER</span>
              <span className="d-val">{student.phone}</span>
            </div>

            <div className="detail-item">
              <span className="d-label">REGISTRATION DATE</span>
              <span className="d-val">{new Date(student.createdAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
            </div>

            <div className="detail-item">
              <span className="d-label">BURSARY STATUS</span>
              <span className="d-val">{student.receivedBursary ? "Yes, Received Previously" : "No, First Time Applicant"}</span>
            </div>
          </div>

          <div className="card-footer-notice">
            <p>
              <strong>Official Notice:</strong> Keep this registration slip safe. Your Registration ID will be required for student verification, zonal welfare representation, and educational initiatives.
            </p>
          </div>
        </div>
      </div>

      <div className="card-actions-row">
        <button onClick={handlePrint} className="print-btn">
          <FaPrint /> Print / Save PDF Slip
        </button>
        {onReset && (
          <button onClick={onReset} className="reset-btn">
            Register Another Student
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentCard;
