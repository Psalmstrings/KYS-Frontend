import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  FaSearch, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaDownload, 
  FaSignOutAlt, 
  FaUserGraduate, 
  FaFilter,
  FaEye,
  FaTimes
} from "react-icons/fa";
import "../styles/admindash.css";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "https://kys-backend.onrender.com";

  const getToken = () => localStorage.getItem("kys_token") || localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    } else {
      fetchStudents();
      fetchStats();
    }
  }, [stateFilter, statusFilter]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/students/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let queryUrl = `${API_URL}/api/students?limit=100`;
      if (stateFilter) queryUrl += `&stateOrigin=${stateFilter}`;
      if (statusFilter) queryUrl += `&verificationStatus=${statusFilter}`;
      if (search.trim()) queryUrl += `&search=${encodeURIComponent(search.trim())}`;

      const res = await fetch(queryUrl, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("kys_token");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Error loading student records");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleVerifyToggle = async (studentId, currentStatus) => {
    const nextStatus = currentStatus === "Verified" ? "Pending" : "Verified";
    try {
      const res = await fetch(`${API_URL}/api/students/${studentId}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ verificationStatus: nextStatus }),
      });

      if (res.ok) {
        toast.success(`Student status updated to ${nextStatus}`);
        fetchStudents();
        fetchStats();
        if (selectedStudent && selectedStudent._id === studentId) {
          setSelectedStudent({ ...selectedStudent, verificationStatus: nextStatus });
        }
      } else {
        toast.error("Failed to update verification status");
      }
    } catch (err) {
      toast.error("Server error while verifying");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("kys_token");
    localStorage.removeItem("kys_user");
    toast.success("Signed out of KYS Admin");
    navigate("/login");
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      toast.error("No student records to export");
      return;
    }

    const headers = ["Reg ID", "Full Name", "Email", "Phone", "Institution", "Course", "Level", "State", "LGA", "Status", "Bursary Received"];
    const rows = students.map((s) => [
      `"${s.registrationId || ""}"`,
      `"${s.fullName || ""}"`,
      `"${s.email || ""}"`,
      `"${s.phone || ""}"`,
      `"${s.institution || ""}"`,
      `"${s.course || ""}"`,
      `"${s.level || ""}"`,
      `"${s.stateOrigin || ""}"`,
      `"${s.lgaOrigin || ""}"`,
      `"${s.verificationStatus || "Pending"}"`,
      `"${s.receivedBursary ? "Yes" : "No"}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KYS_Students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export downloaded!");
  };

  return (
    <div className="admin-container">
      {/* Top Navbar */}
      <div className="admin-top-nav">
        <div className="nav-brand">
          <h2>KYS Portal Management</h2>
          <span>Office of the PRO • NANS Southwest Zone D</span>
        </div>
        <div className="nav-right-actions">
          <Link to="/blog/admin" className="switch-portal-btn">
            Switch to Central Admin CMS →
          </Link>
          <button onClick={handleSignOut} className="signout-btn">
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      <div className="admin-main-content">
        {/* Statistics Cards */}
        {stats && (
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-label">Total Registered</span>
              <h3 className="stat-num">{stats.total}</h3>
            </div>
            <div className="stat-box verified-box">
              <span className="stat-label">Verified Students</span>
              <h3 className="stat-num">{stats.verified}</h3>
            </div>
            <div className="stat-box pending-box">
              <span className="stat-label">Pending Verification</span>
              <h3 className="stat-num">{stats.pending}</h3>
            </div>
            <div className="stat-box">
              <span className="stat-label">Rejected / Flagged</span>
              <h3 className="stat-num">{stats.rejected}</h3>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="controls-card">
          <form onSubmit={handleSearchSubmit} className="search-bar-wrap">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, Reg ID, email, phone, matric number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="search-submit-btn">Search</button>
          </form>

          <div className="filter-selects-row">
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="">All States of Origin</option>
              <option value="Lagos">Lagos State</option>
              <option value="Ogun">Ogun State</option>
              <option value="Oyo">Oyo State</option>
              <option value="Osun">Osun State</option>
              <option value="Ondo">Ondo State</option>
              <option value="Ekiti">Ekiti State</option>
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Verification Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button onClick={handleExportCSV} className="export-csv-btn">
              <FaDownload /> Export CSV
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="table-container">
          {loading ? (
            <p className="loading">Loading student directory...</p>
          ) : (
            <table className="student-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Reg ID</th>
                  <th>Full Name</th>
                  <th>Institution</th>
                  <th>Course & Level</th>
                  <th>State of Origin</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.length > 0 ? (
                  students.map((s, index) => (
                    <tr key={s._id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong style={{ color: "#166534" }}>{s.registrationId || "PENDING"}</strong>
                      </td>
                      <td>{s.fullName}</td>
                      <td>{s.institution}</td>
                      <td>{s.course} ({s.level}L)</td>
                      <td>{s.stateOrigin}</td>
                      <td>{s.phone}</td>
                      <td>
                        <span className={`status-pill ${s.verificationStatus === "Verified" ? "verified" : s.verificationStatus === "Rejected" ? "rejected" : "pending"}`}>
                          {s.verificationStatus || "Pending"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleVerifyToggle(s._id, s.verificationStatus)}
                          className={s.verificationStatus === "Verified" ? "action-btn unverify" : "action-btn verify"}
                          title={s.verificationStatus === "Verified" ? "Revert to Pending" : "Approve Verification"}
                        >
                          {s.verificationStatus === "Verified" ? "Revoke" : "Verify"}
                        </button>
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="action-btn view"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No student records found matching the current criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
          <div className="student-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Student Verification Details</h3>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-content-grid">
              <div className="modal-field">
                <label>Registration ID</label>
                <p><strong>{selectedStudent.registrationId || "Pending"}</strong></p>
              </div>
              <div className="modal-field">
                <label>Verification Status</label>
                <p className={`status-pill ${selectedStudent.verificationStatus === "Verified" ? "verified" : "pending"}`}>
                  {selectedStudent.verificationStatus || "Pending"}
                </p>
              </div>
              <div className="modal-field">
                <label>Full Name</label>
                <p>{selectedStudent.fullName}</p>
              </div>
              <div className="modal-field">
                <label>Date of Birth</label>
                <p>{selectedStudent.dob ? new Date(selectedStudent.dob).toDateString() : "-"}</p>
              </div>
              <div className="modal-field">
                <label>Email Address</label>
                <p>{selectedStudent.email}</p>
              </div>
              <div className="modal-field">
                <label>Phone Number</label>
                <p>{selectedStudent.phone}</p>
              </div>
              <div className="modal-field">
                <label>Institution</label>
                <p>{selectedStudent.institution}</p>
              </div>
              <div className="modal-field">
                <label>Course of Study</label>
                <p>{selectedStudent.course}</p>
              </div>
              <div className="modal-field">
                <label>Academic Level</label>
                <p>{selectedStudent.level} Level</p>
              </div>
              <div className="modal-field">
                <label>Matric No</label>
                <p>{selectedStudent.matricNo || "Not specified"}</p>
              </div>
              <div className="modal-field">
                <label>State & LGA of Origin</label>
                <p>{selectedStudent.stateOrigin} State ({selectedStudent.lgaOrigin})</p>
              </div>
              <div className="modal-field">
                <label>State of Residence</label>
                <p>{selectedStudent.stateResidence} State</p>
              </div>
              <div className="modal-field">
                <label>Address</label>
                <p>{selectedStudent.address}</p>
              </div>
              <div className="modal-field">
                <label>Received Bursary Previously</label>
                <p>{selectedStudent.receivedBursary ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => handleVerifyToggle(selectedStudent._id, selectedStudent.verificationStatus)}
                className={`modal-verify-btn ${selectedStudent.verificationStatus === "Verified" ? "revoke" : "approve"}`}
              >
                {selectedStudent.verificationStatus === "Verified" ? "Revoke Verification" : "Approve Student Verification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
