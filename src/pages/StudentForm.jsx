import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import Navbarr from "../components/Navbarr";
import StudentCard from "../components/StudentCard";
import { FaUserGraduate, FaIdCard, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import "../index.css";
import "../styles/kysPortal.css";

const SOUTHWEST_STATES = ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"];
const OTHER_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Enugu", "FCT - Abuja", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Nasarawa", 
  "Niger", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const PROMINENT_INSTITUTIONS = [
  "University of Lagos (UNILAG)",
  "Obafemi Awolowo University (OAU)",
  "University of Ibadan (UI)",
  "Federal University of Technology Akure (FUTA)",
  "Federal University of Agriculture Abeokuta (FUNAAB)",
  "Lagos State University (LASU)",
  "Olabisi Onabanjo University (OOU)",
  "Ekiti State University (EKSU)",
  "Adekunle Ajasin University (AAUA)",
  "Osun State University (UNIOSUN)",
  "Ladoke Akintola University of Technology (LAUTECH)",
  "Moshood Abiola Polytechnic (MAPOLY)",
  "Yaba College of Technology (YABATECH)",
  "The Polytechnic, Ibadan",
  "Federal Polytechnic, Ilaro",
  "Federal Polytechnic, Ede",
  "Federal Polytechnic, Ado-Ekiti",
  "Rufus Giwa Polytechnic, Owo",
  "Tai Solarin University of Education (TASUED)",
  "Lagos State University of Science and Technology (LASUSTECH)",
  "Lagos State University of Education (LASUED)",
  "Federal University Oye-Ekiti (FUOYE)",
  "Bowen University",
  "Babcock University",
  "Covenant University",
  "Afe Babalola University (ABUAD)",
  "Lead City University",
  "Achievers University",
  "Redeemer's University",
  "Other Institution (Southwest / Nigeria)"
];

const StudentForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    gender: "",
    phone: "",
    lgaOrigin: "",
    stateOrigin: "Lagos",
    address: "",
    stateResidence: "Lagos",
    institution: "",
    course: "",
    level: "100",
    matricNo: "",
    receivedBursary: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registeredStudent, setRegisteredStudent] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://kys-backend.onrender.com";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMessage("");

    if (name === "receivedBursary") {
      setFormData({
        ...formData,
        receivedBursary: value === "Yes",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Form field basic validations
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      toast.error("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your phone number.");
      toast.error("Please enter your phone number.");
      return;
    }

    if (!formData.institution) {
      setErrorMessage("Please specify your tertiary institution.");
      toast.error("Please specify your institution.");
      return;
    }

    if (!formData.dob) {
      setErrorMessage("Please select your date of birth.");
      toast.error("Please select your date of birth.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        toast.success("Registration successful! Welcome to the KYS family.");
        setRegisteredStudent({
          ...formData,
          registrationId: data.data?.registrationId || "KYS-ZD-CONFIRMED",
          createdAt: data.data?.createdAt || new Date().toISOString()
        });
      } else {
        const errorMsg = data.msg || data.message || "Registration failed. Please check your details.";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Submission error:", error);
      const msg = "Unable to connect to the server. Please check your internet connection.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRegisteredStudent(null);
    setFormData({
      fullName: "",
      dob: "",
      email: "",
      gender: "",
      phone: "",
      lgaOrigin: "",
      stateOrigin: "Lagos",
      address: "",
      stateResidence: "Lagos",
      institution: "",
      course: "",
      level: "100",
      matricNo: "",
      receivedBursary: false,
    });
  };

  return (
    <div className="kys-portal-page">
      <Helmet>
        <title>Student Registration | Know Your Student (KYS) Portal - NANS Southwest</title>
        <meta
          name="description"
          content="Official student identification, bursary data capture, and verification registration for students across SouthWest Nigerian tertiary institutions."
        />
        <link rel="canonical" href="https://officeoftheprozoned.com/register" />
      </Helmet>

      <Navbarr />

      <main className="kys-page-main container">
        {registeredStudent ? (
          <StudentCard student={registeredStudent} onReset={handleReset} />
        ) : (
          <div className="form-wrapper-box">
            <div className="form-header-bar">
              <span className="badge-tag">Zone D Official Portal</span>
              <h1 className="portal-title">Know Your Student (KYS) Registration</h1>
              <p className="portal-desc">
                Fill in your accurate academic and personal details to be registered in the NANS Southwest Zone D student directory.
              </p>
            </div>

            {errorMessage && (
              <div className="alert-error-box">
                <FaExclamationTriangle />
                <span>{errorMessage}</span>
              </div>
            )}

            <form className="modern-student-form" onSubmit={handleSubmit}>
              <h3 className="form-section-title">1. Personal & Contact Information</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label>Full Name (Surname First) *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. ADELEKE Babatunde Emmanuel"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@gmail.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phone Number (WhatsApp Preferred) *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 08012345678"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Residential / Campus Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Hostel A, Campus Gate, Akoka"
                    required
                  />
                </div>
              </div>

              <h3 className="form-section-title">2. Origin & Residence</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label>State of Origin *</label>
                  <select name="stateOrigin" value={formData.stateOrigin} onChange={handleChange} required>
                    <optgroup label="Southwest Zone D States">
                      {SOUTHWEST_STATES.map((st) => (
                        <option key={st} value={st}>{st} State</option>
                      ))}
                    </optgroup>
                    <optgroup label="Other Nigerian States">
                      {OTHER_STATES.map((st) => (
                        <option key={st} value={st}>{st} State</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="form-group">
                  <label>LGA of Origin *</label>
                  <input
                    type="text"
                    name="lgaOrigin"
                    value={formData.lgaOrigin}
                    onChange={handleChange}
                    placeholder="e.g. Ikeja, Abeokuta South, Ibadan North"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State of Residence *</label>
                  <select name="stateResidence" value={formData.stateResidence} onChange={handleChange} required>
                    <optgroup label="Southwest Zone D States">
                      {SOUTHWEST_STATES.map((st) => (
                        <option key={st} value={st}>{st} State</option>
                      ))}
                    </optgroup>
                    <optgroup label="Other States">
                      {OTHER_STATES.map((st) => (
                        <option key={st} value={st}>{st} State</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <h3 className="form-section-title">3. Academic Profile</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label>Tertiary Institution *</label>
                  <input
                    list="institutions-list"
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="Type or select your institution"
                    required
                  />
                  <datalist id="institutions-list">
                    {PROMINENT_INSTITUTIONS.map((inst, i) => (
                      <option key={i} value={inst} />
                    ))}
                  </datalist>
                </div>

                <div className="form-group">
                  <label>Course of Study *</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science, Surveying, Law"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Academic Level *</label>
                  <select name="level" value={formData.level} onChange={handleChange} required>
                    <option value="100">100 Level / ND I</option>
                    <option value="200">200 Level / ND II</option>
                    <option value="300">300 Level / HND I</option>
                    <option value="400">400 Level / HND II</option>
                    <option value="500">500 Level</option>
                    <option value="600">600 Level (Medical / Clinical)</option>
                    <option value="Other">Postgraduate / Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Matric / Registration Number (Optional)</label>
                  <input
                    type="text"
                    name="matricNo"
                    value={formData.matricNo}
                    onChange={handleChange}
                    placeholder="e.g. 190404012"
                  />
                </div>

                <div className="form-group">
                  <label>Have You Received Any Zonal/State Bursary Before? *</label>
                  <select
                    name="receivedBursary"
                    value={formData.receivedBursary ? "Yes" : "No"}
                    onChange={handleChange}
                  >
                    <option value="No">No, Never Received Before</option>
                    <option value="Yes">Yes, Have Received Previously</option>
                  </select>
                </div>
              </div>

              <div className="form-consent-box">
                <p>
                  By submitting this form, I confirm that the information provided is accurate and grant permission to the Office of the PRO, NANS Southwest Zone D, to verify my student status for welfare, advocacy, and representation purposes.
                </p>
              </div>

              <div className="form-submit-row">
                <button type="submit" className="kys-submit-btn" disabled={loading}>
                  {loading ? (
                    <span>Registering Record...</span>
                  ) : (
                    <span>Complete KYS Registration →</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} NANS SOUTHWEST — Office of the Public Relations Officer.</p>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about-us">About Us</Link>
            <Link to="/headlines">News</Link>
            <Link to="/verify-status">Verify Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentForm;
