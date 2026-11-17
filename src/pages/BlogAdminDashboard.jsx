import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { 
  FaSave, 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaCheck, 
  FaTimes, 
  FaUserTie, 
  FaNewspaper, 
  FaComments, 
  FaGlobe, 
  FaUserGraduate,
  FaHistory
} from "react-icons/fa";
import "../styles/adminDashboard.css";

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";
const KYS_API_URL = import.meta.env.VITE_API_URL || "https://kys-backend.onrender.com";

export default function BlogAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    totalNews: 0,
    approvedNews: 0,
    pendingNews: 0,
    totalLeaders: 0,
    totalInquiries: 0,
    totalStudents: 0
  });

  // Homepage CMS State
  const [homepageForm, setHomepageForm] = useState({
    hero: {
      title: "",
      subtitle: "",
      description: "",
      ctaText: "",
      ctaLink: ""
    },
    aboutOffice: {
      title: "",
      description: ""
    },
    meetPro: {
      name: "",
      title: "",
      tagline: "",
      bio: ""
    }
  });

  // Org Info CMS State
  const [orgInfoForm, setOrgInfoForm] = useState({
    vision: "",
    mission: "",
    ideology: { title: "", content: "" },
    history: { title: "", content: "" },
    secretariat: { address: "", email: "", phone: "", operationalHours: "" }
  });

  // Leadership state
  const [leaders, setLeaders] = useState([]);
  const [showAddLeaderModal, setShowAddLeaderModal] = useState(false);
  const [newLeader, setNewLeader] = useState({
    fullName: "",
    position: "",
    category: "Executive",
    photo: "",
    biography: "",
    portfolio: "",
    state: "Southwest Zone D",
    administration: "2026-2027",
    displayPriority: 0,
    isFeatured: false
  });

  // Inquiries state
  const [inquiries, setInquiries] = useState([]);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState([]);

  // KYS Integration State
  const [kysStudents, setKysStudents] = useState([]);
  const [kysSearch, setKysSearch] = useState("");
  const [kysLoading, setKysLoading] = useState(false);
  const [kysStatsDetail, setKysStatsDetail] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("pro_admin_token") || localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const getKysAuthHeader = () => {
    const token = localStorage.getItem("kys_token") || localStorage.getItem("pro_admin_token") || localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchKysStudents = async (searchTerm = "") => {
    setKysLoading(true);
    try {
      let queryUrl = `${KYS_API_URL}/api/students?limit=50`;
      if (searchTerm.trim()) {
        queryUrl += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }
      const [studentsRes, statsRes] = await Promise.all([
        axios.get(queryUrl, { headers: getKysAuthHeader() }).catch(() => null),
        axios.get(`${KYS_API_URL}/api/students/stats`, { headers: getKysAuthHeader() }).catch(() => null)
      ]);

      if (studentsRes?.data?.data) {
        setKysStudents(studentsRes.data.data);
      }
      if (statsRes?.data?.stats) {
        setKysStatsDetail(statsRes.data.stats);
      }
    } catch (err) {
      console.error("Error fetching KYS students in CMS:", err);
    } finally {
      setKysLoading(false);
    }
  };

  const handleKysVerifyToggle = async (studentId, currentStatus) => {
    const nextStatus = currentStatus === "Verified" ? "Pending" : "Verified";
    try {
      await axios.put(
        `${KYS_API_URL}/api/students/${studentId}/verify`,
        { verificationStatus: nextStatus },
        { headers: getKysAuthHeader() }
      );
      toast.success(`Student verification updated to ${nextStatus}`);
      fetchKysStudents(kysSearch);
    } catch (err) {
      toast.error("Failed to update student verification status");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch news stats
      const newsStatsRes = await axios.get(`${API_URL}/news/stats`).catch(() => null);
      // 2. Fetch homepage data
      const hpRes = await axios.get(`${API_URL}/homepage`).catch(() => null);
      if (hpRes?.data?.homepage) {
        setHomepageForm(hpRes.data.homepage);
      }
      // 3. Fetch org info
      const orgRes = await axios.get(`${API_URL}/org-info`).catch(() => null);
      if (orgRes?.data?.orgInfo) {
        setOrgInfoForm(orgRes.data.orgInfo);
      }
      // 4. Fetch leadership admin
      const leadRes = await axios.get(`${API_URL}/leadership/admin/all`, { headers: getAuthHeader() }).catch(() => null);
      if (leadRes?.data?.profiles) {
        setLeaders(leadRes.data.profiles);
      }
      // 5. Fetch inquiries
      const inqRes = await axios.get(`${API_URL}/inquiries`, { headers: getAuthHeader() }).catch(() => null);
      if (inqRes?.data?.inquiries) {
        setInquiries(inqRes.data.inquiries);
      }
      // 6. Fetch audit logs
      const auditRes = await axios.get(`${API_URL}/audit-logs`, { headers: getAuthHeader() }).catch(() => null);
      if (auditRes?.data?.logs) {
        setAuditLogs(auditRes.data.logs);
      }
      // 7. Fetch KYS stats
      const kysToken = localStorage.getItem("kys_token") || localStorage.getItem("token");
      const kysStatsRes = await axios.get(`${KYS_API_URL}/api/students/stats`, {
        headers: { Authorization: `Bearer ${kysToken}` }
      }).catch(() => null);

      setStats({
        totalNews: newsStatsRes?.data?.stats?.totalNews || 0,
        approvedNews: newsStatsRes?.data?.stats?.approvedNews || 0,
        pendingNews: newsStatsRes?.data?.stats?.pendingNews || 0,
        totalLeaders: leadRes?.data?.count || 0,
        totalInquiries: inqRes?.data?.count || 0,
        totalStudents: kysStatsRes?.data?.stats?.total || 0
      });
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save Homepage
  const handleSaveHomepage = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/homepage`, homepageForm, { headers: getAuthHeader() });
      toast.success("Homepage content updated successfully!");
    } catch (err) {
      toast.error("Failed to update homepage");
    }
  };

  // Save Org Info
  const handleSaveOrgInfo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/org-info`, orgInfoForm, { headers: getAuthHeader() });
      toast.success("Organizational information updated successfully!");
    } catch (err) {
      toast.error("Failed to update organizational info");
    }
  };

  // Create Leader Profile
  const handleCreateLeader = async (e) => {
    e.preventDefault();
    if (!newLeader.fullName || !newLeader.position) {
      toast.error("Name and Position are required");
      return;
    }
    try {
      await axios.post(`${API_URL}/leadership`, newLeader, { headers: getAuthHeader() });
      toast.success("Leadership profile created successfully!");
      setShowAddLeaderModal(false);
      setNewLeader({
        fullName: "",
        position: "",
        category: "Executive",
        photo: "",
        biography: "",
        portfolio: "",
        state: "Southwest Zone D",
        administration: "2026-2027",
        displayPriority: 0,
        isFeatured: false
      });
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to create leadership profile");
    }
  };

  // Delete Leader Profile
  const handleDeleteLeader = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leadership profile?")) return;
    try {
      await axios.delete(`${API_URL}/leadership/${id}`, { headers: getAuthHeader() });
      toast.success("Profile deleted");
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to delete profile");
    }
  };

  // Update Inquiry Status
  const handleUpdateInquiry = async (id, status) => {
    try {
      await axios.put(`${API_URL}/inquiries/${id}`, { status }, { headers: getAuthHeader() });
      toast.success(`Inquiry marked as ${status}`);
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to update inquiry");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="section">
        <Sidebar />
        <div className="admin-dashboard">
          <div className="admin-header-flex">
            <div>
              <h1>Central Admin Content Management System</h1>
              <p className="admin-subtext">Manage live public website content, leadership, press releases, and inquiries</p>
            </div>
            <button onClick={fetchDashboardData} className="refresh-btn">
              ↻ Refresh Data
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="cms-tabs-bar">
            <button
              className={`cms-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview & Analytics
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "homepage" ? "active" : ""}`}
              onClick={() => setActiveTab("homepage")}
            >
              🏠 Homepage Manager
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "leadership" ? "active" : ""}`}
              onClick={() => setActiveTab("leadership")}
            >
              👥 Leadership Directory
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "orginfo" ? "active" : ""}`}
              onClick={() => setActiveTab("orginfo")}
            >
              🏛️ About & Ideals
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "inquiries" ? "active" : ""}`}
              onClick={() => setActiveTab("inquiries")}
            >
              📬 Inquiries ({inquiries.filter(i => i.status === "New").length} New)
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "kys" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("kys");
                fetchKysStudents();
              }}
            >
              🎓 KYS Student Portal ({stats.totalStudents})
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "audit" ? "active" : ""}`}
              onClick={() => setActiveTab("audit")}
            >
              🛡️ Audit Trail
            </button>
          </div>

          {loading ? (
            <div className="cms-loading-box">
              <div className="spinner"></div>
              <p>Connecting to database services...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="cms-tab-content">
                  <div className="stats-cards">
                    <div className="card">
                      <h3>Total News Articles</h3>
                      <p>{stats.totalNews}</p>
                      <span className="card-sub">{stats.approvedNews} Approved • {stats.pendingNews} Pending</span>
                    </div>
                    <div className="card">
                      <h3>Leadership Profiles</h3>
                      <p>{stats.totalLeaders}</p>
                      <span className="card-sub">Executives & State PROs</span>
                    </div>
                    <div className="card">
                      <h3>Student Inquiries</h3>
                      <p>{stats.totalInquiries}</p>
                      <span className="card-sub">{inquiries.filter(i => i.status === "New").length} Unreviewed</span>
                    </div>
                    <div className="card highlight">
                      <h3>KYS Registered Students</h3>
                      <p>{stats.totalStudents}</p>
                      <span className="card-sub">Direct portal records</span>
                    </div>
                  </div>

                  {/* Quick Action Cards */}
                  <div className="quick-actions-grid">
                    <div className="qa-card" onClick={() => setActiveTab("homepage")}>
                      <h4>Edit Homepage Content</h4>
                      <p>Update hero headlines, About text, and Meet the PRO quotes.</p>
                      <span>Manage Homepage →</span>
                    </div>
                    <div className="qa-card" onClick={() => setActiveTab("leadership")}>
                      <h4>Manage Leadership</h4>
                      <p>Add new executives, state PROs, and update individual portfolios.</p>
                      <span>Manage Directory →</span>
                    </div>
                    <div className="qa-card" onClick={() => window.location.href = "/admin/news"}>
                      <h4>Review Press Releases</h4>
                      <p>Approve pending submissions, publish new stories, or edit articles.</p>
                      <span>Manage News →</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HOMEPAGE CMS */}
              {activeTab === "homepage" && (
                <div className="cms-tab-content">
                  <form onSubmit={handleSaveHomepage} className="cms-form-card">
                    <h2>Homepage Content Management</h2>
                    <p className="form-tip">Changes saved here automatically update the public homepage.</p>

                    <h3 className="section-divider-title">1. Hero Section</h3>
                    <div className="form-grid-2">
                      <div className="cms-field">
                        <label>Hero Main Title</label>
                        <input
                          type="text"
                          value={homepageForm.hero?.title || ""}
                          onChange={(e) => setHomepageForm({
                            ...homepageForm,
                            hero: { ...homepageForm.hero, title: e.target.value }
                          })}
                        />
                      </div>
                      <div className="cms-field">
                        <label>Hero Subtitle</label>
                        <input
                          type="text"
                          value={homepageForm.hero?.subtitle || ""}
                          onChange={(e) => setHomepageForm({
                            ...homepageForm,
                            hero: { ...homepageForm.hero, subtitle: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div className="cms-field">
                      <label>Hero Description</label>
                      <textarea
                        rows="3"
                        value={homepageForm.hero?.description || ""}
                        onChange={(e) => setHomepageForm({
                          ...homepageForm,
                          hero: { ...homepageForm.hero, description: e.target.value }
                        })}
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="cms-field">
                        <label>Call-to-Action Text</label>
                        <input
                          type="text"
                          value={homepageForm.hero?.ctaText || ""}
                          onChange={(e) => setHomepageForm({
                            ...homepageForm,
                            hero: { ...homepageForm.hero, ctaText: e.target.value }
                          })}
                        />
                      </div>
                      <div className="cms-field">
                        <label>Call-to-Action Link</label>
                        <input
                          type="text"
                          value={homepageForm.hero?.ctaLink || ""}
                          onChange={(e) => setHomepageForm({
                            ...homepageForm,
                            hero: { ...homepageForm.hero, ctaLink: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <h3 className="section-divider-title">2. Meet the PRO Section</h3>
                    <div className="form-grid-2">
                      <div className="cms-field">
                        <label>Officer Name</label>
                        <input
                          type="text"
                          value={homepageForm.meetPro?.name || ""}
                          onChange={(e) => setHomepageForm({
                            ...homepageForm,
                            meetPro: { ...homepageForm.meetPro, name: e.target.value }
                          })}
                        />
                      </div>
                      <div className="cms-field">
                        <label>Official Title</label>
                        <input
                          type="text"
                          value={homepageForm.meetPro?.title || ""}
                          onChange={(e) => setHomepageForm({
                            ...homepageForm,
                            meetPro: { ...homepageForm.meetPro, title: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div className="cms-field">
                      <label>Leadership Tagline / Quote</label>
                      <input
                        type="text"
                        value={homepageForm.meetPro?.tagline || ""}
                        onChange={(e) => setHomepageForm({
                          ...homepageForm,
                          meetPro: { ...homepageForm.meetPro, tagline: e.target.value }
                        })}
                      />
                    </div>

                    <div className="cms-field">
                      <label>Leadership Biography Excerpt</label>
                      <textarea
                        rows="4"
                        value={homepageForm.meetPro?.bio || ""}
                        onChange={(e) => setHomepageForm({
                          ...homepageForm,
                          meetPro: { ...homepageForm.meetPro, bio: e.target.value }
                        })}
                      />
                    </div>

                    <button type="submit" className="save-cms-btn">
                      <FaSave /> Save Homepage Configuration
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: LEADERSHIP DIRECTORY */}
              {activeTab === "leadership" && (
                <div className="cms-tab-content">
                  <div className="tab-header-row">
                    <div>
                      <h2>Leadership & Executive Directory</h2>
                      <p>Manage officers, executives, state PROs, and portfolio profiles.</p>
                    </div>
                    <button onClick={() => setShowAddLeaderModal(true)} className="create-btn">
                      <FaPlus /> Add New Officer
                    </button>
                  </div>

                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Officer Name</th>
                        <th>Position</th>
                        <th>Category</th>
                        <th>State / Zone</th>
                        <th>Administration</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaders.map((l) => (
                        <tr key={l._id}>
                          <td><strong>{l.fullName}</strong></td>
                          <td>{l.position}</td>
                          <td><span className="badge-tag">{l.category}</span></td>
                          <td>{l.state || "Southwest Zone D"}</td>
                          <td>{l.administration}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteLeader(l._id)}
                              className="delete-icon-btn"
                              title="Delete Officer"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 4: ORG INFO (ABOUT US) */}
              {activeTab === "orginfo" && (
                <div className="cms-tab-content">
                  <form onSubmit={handleSaveOrgInfo} className="cms-form-card">
                    <h2>Organizational Content & Ideals</h2>
                    <p className="form-tip">Content for the About Us page, vision, mission, and secretariat contacts.</p>

                    <div className="cms-field">
                      <label>Our Vision</label>
                      <textarea
                        rows="3"
                        value={orgInfoForm.vision || ""}
                        onChange={(e) => setOrgInfoForm({ ...orgInfoForm, vision: e.target.value })}
                      />
                    </div>

                    <div className="cms-field">
                      <label>Our Mission</label>
                      <textarea
                        rows="3"
                        value={orgInfoForm.mission || ""}
                        onChange={(e) => setOrgInfoForm({ ...orgInfoForm, mission: e.target.value })}
                      />
                    </div>

                    <div className="cms-field">
                      <label>Guiding Ideology Content</label>
                      <textarea
                        rows="4"
                        value={orgInfoForm.ideology?.content || ""}
                        onChange={(e) => setOrgInfoForm({
                          ...orgInfoForm,
                          ideology: { ...orgInfoForm.ideology, content: e.target.value }
                        })}
                      />
                    </div>

                    <div className="cms-field">
                      <label>Organizational History</label>
                      <textarea
                        rows="4"
                        value={orgInfoForm.history?.content || ""}
                        onChange={(e) => setOrgInfoForm({
                          ...orgInfoForm,
                          history: { ...orgInfoForm.history, content: e.target.value }
                        })}
                      />
                    </div>

                    <button type="submit" className="save-cms-btn">
                      <FaSave /> Save Organizational Information
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: INQUIRIES */}
              {activeTab === "inquiries" && (
                <div className="cms-tab-content">
                  <h2>Student Complaints & Inquiries</h2>
                  <p className="form-tip">Messages submitted via the public website contact form.</p>

                  {inquiries.length === 0 ? (
                    <p>No inquiries submitted yet.</p>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Full Name</th>
                          <th>Institution</th>
                          <th>Complaint / Message</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.map((inq) => (
                          <tr key={inq._id}>
                            <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                            <td>
                              <strong>{inq.fullName}</strong>
                              <br /><small>{inq.email || inq.phone}</small>
                            </td>
                            <td>{inq.school} ({inq.level})</td>
                            <td style={{ maxWidth: "300px" }}>{inq.message}</td>
                            <td>
                              <span className={`status-pill ${inq.status === "Resolved" ? "verified" : inq.status === "In Review" ? "pending" : "rejected"}`}>
                                {inq.status}
                              </span>
                            </td>
                            <td>
                              {inq.status !== "Resolved" ? (
                                <button
                                  onClick={() => handleUpdateInquiry(inq._id, "Resolved")}
                                  className="action-btn verify"
                                >
                                  Mark Resolved
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateInquiry(inq._id, "New")}
                                  className="action-btn unverify"
                                >
                                  Reopen
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB 6: AUDIT TRAIL */}
              {activeTab === "audit" && (
                <div className="cms-tab-content">
                  <h2>Administrative Action Audit Trail</h2>
                  <p className="form-tip">Automatic security logging of content updates, logins, and publishing.</p>

                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Administrator</th>
                        <th>Action</th>
                        <th>Module</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.length > 0 ? (
                        auditLogs.map((log) => (
                          <tr key={log._id}>
                            <td>{new Date(log.createdAt).toLocaleString()}</td>
                            <td>{log.adminEmail}</td>
                            <td><code>{log.action}</code></td>
                            <td>{log.module}</td>
                            <td><small>{JSON.stringify(log.details)}</small></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No audit entries logged yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 7: KYS STUDENT RECORDS */}
              {activeTab === "kys" && (
                <div className="cms-tab-content">
                  <div className="cms-form-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                      <div>
                        <h2>Know Your Student (KYS) — Database Integration</h2>
                        <p className="form-tip">
                          Connected directly to KYS Database (<code style={{ background: "#f0fdf4", padding: "2px 6px", borderRadius: "4px", color: "#166534" }}>cluster0/kys</code>) & API Server.
                        </p>
                      </div>
                      <button 
                        onClick={() => window.open("/admin", "_blank")}
                        className="cms-btn-primary"
                        style={{ margin: 0, padding: "10px 18px", fontSize: "0.9rem" }}
                      >
                        Launch Dedicated KYS Portal ↗
                      </button>
                    </div>

                    {/* Stats strip */}
                    <div className="stats-cards" style={{ marginBottom: "24px" }}>
                      <div className="card">
                        <h3>Total Registered</h3>
                        <p>{kysStatsDetail?.total || stats.totalStudents}</p>
                        <span className="card-sub">All Southwest Institutions</span>
                      </div>
                      <div className="card">
                        <h3>Verified Students</h3>
                        <p style={{ color: "#16a34a" }}>{kysStatsDetail?.verified || 0}</p>
                        <span className="card-sub">Active verified profiles</span>
                      </div>
                      <div className="card">
                        <h3>Pending Review</h3>
                        <p style={{ color: "#d97706" }}>{kysStatsDetail?.pending || 0}</p>
                        <span className="card-sub">Awaiting verification</span>
                      </div>
                      <div className="card">
                        <h3>Flagged / Rejected</h3>
                        <p style={{ color: "#dc2626" }}>{kysStatsDetail?.rejected || 0}</p>
                        <span className="card-sub">Discrepant records</span>
                      </div>
                    </div>

                    {/* Student search form */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        fetchKysStudents(kysSearch);
                      }} 
                      style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}
                    >
                      <input
                        type="text"
                        placeholder="Search student by name, Reg ID, institution, state..."
                        value={kysSearch}
                        onChange={(e) => setKysSearch(e.target.value)}
                        style={{ flex: 1, minWidth: "260px", padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.95rem" }}
                      />
                      <button type="submit" className="refresh-btn" style={{ background: "#15803d", color: "#fff", borderColor: "#15803d" }}>
                        Search KYS
                      </button>
                      {kysSearch && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setKysSearch("");
                            fetchKysStudents("");
                          }}
                          className="refresh-btn"
                        >
                          Clear
                        </button>
                      )}
                    </form>

                    {/* Student table */}
                    <div className="table-container">
                      {kysLoading ? (
                        <p style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>Querying KYS Database...</p>
                      ) : kysStudents.length === 0 ? (
                        <div style={{ padding: "36px", textAlign: "center", color: "#64748b" }}>
                          <p>No student records found in KYS database.</p>
                          <small>Students registering at <code>/register</code> will appear here automatically.</small>
                        </div>
                      ) : (
                        <table className="student-table">
                          <thead>
                            <tr>
                              <th>S/N</th>
                              <th>Registration ID</th>
                              <th>Student Name</th>
                              <th>Institution</th>
                              <th>Course & Level</th>
                              <th>State of Origin</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {kysStudents.map((s, idx) => (
                              <tr key={s._id}>
                                <td>{idx + 1}</td>
                                <td><strong style={{ color: "#166534" }}>{s.registrationId || "PENDING"}</strong></td>
                                <td>{s.fullName}</td>
                                <td>{s.institution}</td>
                                <td>{s.course} ({s.level}L)</td>
                                <td>{s.stateOrigin}</td>
                                <td>
                                  <span className={`status-pill ${s.verificationStatus === "Verified" ? "verified" : s.verificationStatus === "Rejected" ? "rejected" : "pending"}`}>
                                    {s.verificationStatus || "Pending"}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleKysVerifyToggle(s._id, s.verificationStatus)}
                                    className={`action-btn ${s.verificationStatus === "Verified" ? "unverify" : "verify"}`}
                                  >
                                    {s.verificationStatus === "Verified" ? "Set Pending" : "Verify Student"}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Add Leader Modal */}
          {showAddLeaderModal && (
            <div className="modal-backdrop" onClick={() => setShowAddLeaderModal(false)}>
              <div className="student-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Add Leadership / Executive Profile</h3>
                  <button className="close-btn" onClick={() => setShowAddLeaderModal(false)}>
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleCreateLeader} className="modal-form-body">
                  <div className="form-grid-2">
                    <div className="cms-field">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Comrade Adebayo Smart"
                        value={newLeader.fullName}
                        onChange={(e) => setNewLeader({ ...newLeader, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="cms-field">
                      <label>Official Position *</label>
                      <input
                        type="text"
                        placeholder="e.g. Director of Student Affairs"
                        value={newLeader.position}
                        onChange={(e) => setNewLeader({ ...newLeader, position: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="cms-field">
                      <label>Leadership Category *</label>
                      <select
                        value={newLeader.category}
                        onChange={(e) => setNewLeader({ ...newLeader, category: e.target.value })}
                      >
                        <option value="Executive">Executive</option>
                        <option value="Director">Director</option>
                        <option value="Deputy Director">Deputy Director</option>
                        <option value="Special Assistant">Special Assistant</option>
                        <option value="Senior Special Assistant">Senior Special Assistant</option>
                        <option value="Media Team">Media Team</option>
                        <option value="State PRO">State PRO</option>
                      </select>
                    </div>

                    <div className="cms-field">
                      <label>State / Coverage</label>
                      <input
                        type="text"
                        placeholder="e.g. Lagos State, Southwest Zone D"
                        value={newLeader.state}
                        onChange={(e) => setNewLeader({ ...newLeader, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="cms-field">
                    <label>Photo URL (Cloudinary or Direct Link)</label>
                    <input
                      type="url"
                      placeholder="https://res.cloudinary.com/..."
                      value={newLeader.photo}
                      onChange={(e) => setNewLeader({ ...newLeader, photo: e.target.value })}
                    />
                  </div>

                  <div className="cms-field">
                    <label>Portfolio Focus & Responsibilities</label>
                    <textarea
                      rows="3"
                      placeholder="Describe officer's scope of duty, advocacy projects, or responsibilities..."
                      value={newLeader.portfolio}
                      onChange={(e) => setNewLeader({ ...newLeader, portfolio: e.target.value })}
                    />
                  </div>

                  <div className="cms-field">
                    <label>Officer Biography</label>
                    <textarea
                      rows="3"
                      placeholder="Brief background and leadership profile..."
                      value={newLeader.biography}
                      onChange={(e) => setNewLeader({ ...newLeader, biography: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="save-cms-btn">
                    Create Leadership Profile
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
