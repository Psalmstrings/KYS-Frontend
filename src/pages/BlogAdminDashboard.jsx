import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
  FaHistory,
  FaChartLine,
  FaUsers,
  FaCloudUploadAlt,
  FaExternalLinkAlt,
  FaSearch,
  FaFilter,
  FaEye,
  FaLock,
  FaRedo,
  FaArrowUp,
  FaArrowDown,
  FaSortAmountDown
} from "react-icons/fa";
import "../styles/adminDashboard.css";

// Fallback high-res assets for officers so NO broken images can ever appear
import nansLogo from "../assets/download__4_-removebg-preview.png";
import proImage from "../assets/IMG_2842.JPG";
import osunPro from "../assets/COMR IBRAHEEM.jpeg";
import lagosPro from "../assets/Comrade Ridwan.jpeg";
import oyoPro from "../assets/COMRADE. ADEYANJU.jpeg";
import ondoPro from "../assets/JOHNPAU.jpeg";
import ekitiPro from "../assets/AD Smart.jpeg";
import ogunPro from "../assets/Celebrity Farmer.jpeg";

const fallbackPhotoMap = {
  "Comrade Tope Olugbemi (Celebrity Surveyor)": proImage,
  "Comrade Ibraheem Ayomide Alabi (IB POL)": osunPro,
  "Comrade Ridwan Ajayi": lagosPro,
  "Johnpaul Olamakinde Alabi (Makins)": ondoPro,
  "Comrade Adeyanju Joshua (Aniyikaye)": oyoPro,
  "Comr Sodiq Hassan (Celebrity Farmer)": ogunPro,
  "Comrade Adesipe Smart Ayodeji F. (AD Smart)": ekitiPro,
};

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";
const KYS_API_URL = import.meta.env.VITE_API_URL || "https://kys-backend.onrender.com";

const SOUTHWEST_STATES = ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"];

export default function BlogAdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  // Overall counts
  const [stats, setStats] = useState({
    totalNews: 0,
    approvedNews: 0,
    pendingNews: 0,
    totalLeaders: 0,
    totalInquiries: 0,
    totalStudents: 0
  });

  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    todayViews: 0,
    weekViews: 0,
    topPages: [],
    topRegions: [],
    topCountries: [],
    devices: [],
    recentVisits: []
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
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState(null);
  const [leadershipFilter, setLeadershipFilter] = useState("all");
  const [leadershipSearch, setLeadershipSearch] = useState("");
  const [leaderForm, setLeaderForm] = useState({
    fullName: "",
    position: "",
    category: "Executive",
    isAppointee: false,
    photo: "",
    biography: "",
    portfolio: "",
    state: "Southwest Zone D",
    administration: "2026-2027",
    displayPriority: 0,
    isFeatured: false
  });
  const [leaderPhotoFile, setLeaderPhotoFile] = useState(null);
  const [leaderPhotoPreview, setLeaderPhotoPreview] = useState("");
  const [leaderSubmitting, setLeaderSubmitting] = useState(false);

  // Leadership hierarchy & reordering state
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);
  const [hierarchyCategory, setHierarchyCategory] = useState("appointees");
  const [hierarchyList, setHierarchyList] = useState([]);
  const [hierarchySaving, setHierarchySaving] = useState(false);

  // Classification helper functions
  const checkIsAppointee = (l) =>
    Boolean(l.isAppointee) ||
    l.category === "Appointee" ||
    l.category === "Appointee (Office of the PRO)" ||
    l.category === "Special Assistant" ||
    l.category === "Senior Special Assistant" ||
    l.category === "Director" ||
    l.category === "Deputy Director" ||
    l.category === "Media Aide" ||
    (l.position && (
      l.position.toLowerCase().includes("appointee") ||
      l.position.toLowerCase().includes("special assistant") ||
      l.position.toLowerCase().includes("aide") ||
      l.position.toLowerCase().includes("chief of staff")
    ));

  const checkIsStatePro = (l) =>
    (l.category === "State PRO" || (l.position && l.position.includes("JCC"))) &&
    !checkIsAppointee(l);

  const checkIsExecutive = (l) =>
    (l.category === "Executive" || l._id === "exec-pro") &&
    !checkIsAppointee(l) &&
    !checkIsStatePro(l);

  const getFilteredHierarchySubset = (cat, srcList = leaders) => {
    let subset = [...srcList];
    if (cat === "appointees") {
      subset = subset.filter(checkIsAppointee);
    } else if (cat === "executives") {
      subset = subset.filter(checkIsExecutive);
    } else if (cat === "statePros") {
      subset = subset.filter(checkIsStatePro);
    }
    return subset.sort((a, b) => (Number(a.displayPriority) || 0) - (Number(b.displayPriority) || 0));
  };

  const openHierarchyModal = (defaultCat = "appointees") => {
    const chosenCat = defaultCat === "all" ? "appointees" : defaultCat;
    setHierarchyCategory(chosenCat);
    setHierarchyList(getFilteredHierarchySubset(chosenCat));
    setShowHierarchyModal(true);
  };

  const switchHierarchyCategory = (cat) => {
    setHierarchyCategory(cat);
    setHierarchyList(getFilteredHierarchySubset(cat));
  };

  const moveHierarchyItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= hierarchyList.length) return;
    const updated = [...hierarchyList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    const reindexed = updated.map((item, idx) => ({
      ...item,
      displayPriority: idx + 1
    }));
    setHierarchyList(reindexed);
  };

  const saveHierarchyOrder = async () => {
    setHierarchySaving(true);
    const toastId = toast.loading("Saving hierarchy display order...");
    try {
      const itemsToUpdate = hierarchyList.map((item, idx) => ({
        id: item._id,
        displayPriority: idx + 1
      }));

      await axios.put(`${API_URL}/leadership/reorder`, { items: itemsToUpdate }, {
        headers: getAuthHeader()
      });

      toast.success("Leadership hierarchy updated successfully!", { id: toastId });
      setShowHierarchyModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Hierarchy save error:", err);
      toast.error(err.response?.data?.message || "Failed to save hierarchy order", { id: toastId });
    } finally {
      setHierarchySaving(false);
    }
  };

  const handleQuickMove = async (leader, direction, currentFilteredList) => {
    const currentIndex = currentFilteredList.findIndex(l => l._id === leader._id);
    const targetIndex = currentIndex + direction;
    if (currentIndex === -1 || targetIndex < 0 || targetIndex >= currentFilteredList.length) return;

    const toastId = toast.loading(`Moving ${leader.fullName}...`);
    try {
      const updatedList = [...currentFilteredList];
      const temp = updatedList[currentIndex];
      updatedList[currentIndex] = updatedList[targetIndex];
      updatedList[targetIndex] = temp;

      const itemsToUpdate = updatedList.map((item, idx) => ({
        id: item._id,
        displayPriority: idx + 1
      }));

      await axios.put(`${API_URL}/leadership/reorder`, { items: itemsToUpdate }, {
        headers: getAuthHeader()
      });

      toast.success(`Position updated! ${leader.fullName} moved ${direction < 0 ? "up" : "down"}.`, { id: toastId });
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to reorder position", { id: toastId });
    }
  };

  const handleUpdatePriority = async (leaderId, newPriority) => {
    const num = parseInt(newPriority, 10);
    if (isNaN(num)) return;
    try {
      await axios.put(`${API_URL}/leadership/reorder`, {
        items: [{ id: leaderId, displayPriority: num }]
      }, {
        headers: getAuthHeader()
      });
      toast.success("Order priority updated!");
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to update priority");
    }
  };

  // Blogger Management state
  const [bloggers, setBloggers] = useState([]);
  const [showBloggerModal, setShowBloggerModal] = useState(false);
  const [bloggerSubmitting, setBloggerSubmitting] = useState(false);
  const [newBlogger, setNewBlogger] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    avatar: ""
  });

  // Inquiries state
  const [inquiries, setInquiries] = useState([]);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState([]);

  // KYS Integration State
  const [kysStudents, setKysStudents] = useState([]);
  const [kysSearch, setKysSearch] = useState("");
  const [kysStateFilter, setKysStateFilter] = useState("All");
  const [kysStatusFilter, setKysStatusFilter] = useState("All");
  const [kysLoading, setKysLoading] = useState(false);
  const [kysStatsDetail, setKysStatsDetail] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("pro_admin_token") || localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const getKysAuthHeader = () => {
    const token = localStorage.getItem("kys_token") || localStorage.getItem("pro_admin_token") || localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "kys") {
      fetchKysStudents(kysSearch);
    } else if (activeTab === "bloggers") {
      fetchBloggers();
    } else if (activeTab === "analytics") {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [newsStatsRes, hpRes, orgRes, leadRes, inqRes, auditRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/news/stats`).catch(() => null),
        axios.get(`${API_URL}/homepage`).catch(() => null),
        axios.get(`${API_URL}/org-info`).catch(() => null),
        axios.get(`${API_URL}/leadership/admin/all`, { headers: getAuthHeader() }).catch(() => null),
        axios.get(`${API_URL}/inquiries`, { headers: getAuthHeader() }).catch(() => null),
        axios.get(`${API_URL}/audit-logs`, { headers: getAuthHeader() }).catch(() => null),
        axios.get(`${API_URL}/analytics/stats`, { headers: getAuthHeader() }).catch(() => null),
      ]);

      if (hpRes?.data?.homepage) setHomepageForm(hpRes.data.homepage);
      if (orgRes?.data?.orgInfo) setOrgInfoForm(orgRes.data.orgInfo);
      if (leadRes?.data?.profiles) setLeaders(leadRes.data.profiles);
      if (inqRes?.data?.inquiries) setInquiries(inqRes.data.inquiries);
      if (auditRes?.data?.logs) setAuditLogs(auditRes.data.logs);
      if (analyticsRes?.data?.stats) setAnalytics(analyticsRes.data.stats);

      // KYS stats
      const kysStatsRes = await axios.get(`${KYS_API_URL}/api/students/stats`, {
        headers: getKysAuthHeader()
      }).catch(() => null);

      if (kysStatsRes?.data?.stats) {
        setKysStatsDetail(kysStatsRes.data.stats);
      }

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

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/analytics/stats`, { headers: getAuthHeader() });
      if (res?.data?.stats) {
        setAnalytics(res.data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  };

  const fetchBloggers = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/bloggers`, { headers: getAuthHeader() });
      if (res?.data?.bloggers) {
        setBloggers(res.data.bloggers);
      }
    } catch (err) {
      console.error("Failed to fetch bloggers:", err);
    }
  };

  const fetchKysStudents = async (searchTerm = "") => {
    setKysLoading(true);
    try {
      let queryUrl = `${KYS_API_URL}/api/students?limit=100`;
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
      toast.success("Organizational ideals updated successfully!");
    } catch (err) {
      toast.error("Failed to update organizational info");
    }
  };

  // Open Add Leader Modal
  const openAddLeaderModal = () => {
    setEditingLeaderId(null);
    setLeaderForm({
      fullName: "",
      position: "",
      category: "Executive",
      isAppointee: false,
      photo: "",
      biography: "",
      portfolio: "",
      state: "Southwest Zone D",
      administration: "2026-2027",
      displayPriority: 0,
      isFeatured: false
    });
    setLeaderPhotoFile(null);
    setLeaderPhotoPreview("");
    setShowLeaderModal(true);
  };

  // Open Add Appointee Modal (Office of the PRO)
  const openAddAppointeeModal = () => {
    setEditingLeaderId(null);
    setLeaderForm({
      fullName: "",
      position: "",
      category: "Appointee",
      isAppointee: true,
      photo: "",
      biography: "",
      portfolio: "",
      state: "Southwest Zone D",
      administration: "2026-2027",
      displayPriority: 10,
      isFeatured: false
    });
    setLeaderPhotoFile(null);
    setLeaderPhotoPreview("");
    setShowLeaderModal(true);
  };

  // Open Edit Leader Modal
  const openEditLeaderModal = (leader) => {
    setEditingLeaderId(leader._id);
    const isApp = Boolean(leader.isAppointee) || 
      leader.category === "Appointee" || 
      leader.category === "Appointee (Office of the PRO)" ||
      leader.category === "Special Assistant" ||
      leader.category === "Senior Special Assistant" ||
      leader.category === "Media Aide" ||
      (leader.position && (
        leader.position.toLowerCase().includes("appointee") ||
        leader.position.toLowerCase().includes("special assistant") ||
        leader.position.toLowerCase().includes("aide") ||
        leader.position.toLowerCase().includes("chief of staff")
      ));

    setLeaderForm({
      fullName: leader.fullName || "",
      position: leader.position || "",
      category: leader.category || (isApp ? "Appointee" : "Executive"),
      isAppointee: isApp,
      photo: leader.photo || "",
      biography: leader.biography || "",
      portfolio: leader.portfolio || "",
      state: leader.state || "Southwest Zone D",
      administration: leader.administration || "2026-2027",
      displayPriority: leader.displayPriority || 0,
      isFeatured: Boolean(leader.isFeatured)
    });
    setLeaderPhotoFile(null);
    const resolvedPhoto = leader.photo || fallbackPhotoMap[leader.fullName] || "";
    setLeaderPhotoPreview(resolvedPhoto);
    setShowLeaderModal(true);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLeaderPhotoFile(file);
      setLeaderPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Save Leadership Profile (Multipart with Cloudinary)
  const handleSaveLeader = async (e) => {
    e.preventDefault();
    if (!leaderForm.fullName.trim() || !leaderForm.position.trim()) {
      toast.error("Full name and official position are required");
      return;
    }

    setLeaderSubmitting(true);
    const isApp = Boolean(leaderForm.isAppointee || leaderForm.category === "Appointee" || leaderForm.category === "Appointee (Office of the PRO)");
    const toastId = toast.loading(
      leaderPhotoFile 
        ? `Uploading photograph to Cloudinary & saving ${isApp ? "appointee" : "leader"} profile...` 
        : `Saving ${isApp ? "appointee" : "leader"} profile...`
    );

    try {
      const formData = new FormData();
      formData.append("fullName", leaderForm.fullName);
      formData.append("position", leaderForm.position);
      formData.append("category", leaderForm.category);
      formData.append("isAppointee", isApp);
      formData.append("state", leaderForm.state);
      formData.append("administration", leaderForm.administration);
      formData.append("displayPriority", leaderForm.displayPriority);
      formData.append("isFeatured", leaderForm.isFeatured);
      formData.append("biography", leaderForm.biography);
      formData.append("portfolio", leaderForm.portfolio);

      if (leaderPhotoFile) {
        formData.append("photo", leaderPhotoFile);
      } else if (leaderForm.photo) {
        formData.append("photo", leaderForm.photo);
      }

      if (editingLeaderId) {
        await axios.put(`${API_URL}/leadership/${editingLeaderId}`, formData, {
          headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" }
        });
        toast.success(isApp ? "Office Appointee profile updated!" : "Leadership profile updated successfully!", { id: toastId });
      } else {
        await axios.post(`${API_URL}/leadership`, formData, {
          headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" }
        });
        toast.success(isApp ? "Office of the PRO Appointee added & published!" : "Leadership profile created and published!", { id: toastId });
      }

      setShowLeaderModal(false);
      setLeaderPhotoFile(null);
      setLeaderPhotoPreview("");
      fetchDashboardData();
    } catch (err) {
      console.error("Leadership save error:", err);
      toast.error(err.response?.data?.message || "Failed to save leadership profile", { id: toastId });
    } finally {
      setLeaderSubmitting(false);
    }
  };

  // Delete Leader Profile
  const handleDeleteLeader = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leadership profile?")) return;
    try {
      await axios.delete(`${API_URL}/leadership/${id}`, { headers: getAuthHeader() });
      toast.success("Profile deleted successfully");
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to delete profile");
    }
  };

  // Create Blogger Account
  const handleCreateBlogger = async (e) => {
    e.preventDefault();
    if (!newBlogger.name.trim() || !newBlogger.email.trim() || !newBlogger.password) {
      toast.error("Name, email, and initial password are required");
      return;
    }

    setBloggerSubmitting(true);
    try {
      await axios.post(`${API_URL}/auth/blogger/create`, newBlogger, { headers: getAuthHeader() });
      toast.success(`Blogger account created for ${newBlogger.name}!`);
      setShowBloggerModal(false);
      setNewBlogger({ name: "", email: "", password: "", bio: "", avatar: "" });
      fetchBloggers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create blogger account");
    } finally {
      setBloggerSubmitting(false);
    }
  };

  // Toggle Blogger Status (Active / Suspended)
  const handleToggleBlogger = async (id) => {
    try {
      await axios.put(`${API_URL}/auth/bloggers/${id}/toggle`, {}, { headers: getAuthHeader() });
      toast.success("Blogger status updated");
      fetchBloggers();
    } catch (err) {
      toast.error("Failed to update blogger status");
    }
  };

  // Delete Blogger
  const handleDeleteBlogger = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete blogger "${name}"?`)) return;
    try {
      await axios.delete(`${API_URL}/auth/bloggers/${id}`, { headers: getAuthHeader() });
      toast.success("Blogger deleted");
      fetchBloggers();
    } catch (err) {
      toast.error("Failed to delete blogger");
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

  // Filtered KYS students
  const filteredStudents = kysStudents.filter((st) => {
    const matchesState = kysStateFilter === "All" || st.stateOrigin === kysStateFilter || st.stateResidence === kysStateFilter;
    const matchesStatus = kysStatusFilter === "All" || st.verificationStatus === kysStatusFilter;
    return matchesState && matchesStatus;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar />
      <div className="section">
        <Sidebar />
        <div className="admin-dashboard">
          {/* Header */}
          <div className="admin-header-flex">
            <div>
              <h1>Central Administration Control Center</h1>
              <p className="admin-subtext">Authoritative management of public website content, leadership, KYS verification, bloggers, and visitor analytics.</p>
            </div>
            <button onClick={fetchDashboardData} className="refresh-btn">
              <FaRedo /> Refresh Data
            </button>
          </div>

          {/* Clean CMS Tabs Bar */}
          <div className="cms-tabs-bar">
            <button
              className={`cms-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => switchTab("overview")}
            >
              Overview
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => switchTab("analytics")}
            >
              Analytics & Traffic
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "leadership" ? "active" : ""}`}
              onClick={() => switchTab("leadership")}
            >
              Leadership Directory
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "kys" ? "active" : ""}`}
              onClick={() => switchTab("kys")}
            >
              KYS Student Records ({stats.totalStudents})
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "bloggers" ? "active" : ""}`}
              onClick={() => switchTab("bloggers")}
            >
              Blogger Team
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "homepage" ? "active" : ""}`}
              onClick={() => switchTab("homepage")}
            >
              Homepage CMS
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "orginfo" ? "active" : ""}`}
              onClick={() => switchTab("orginfo")}
            >
              Ideals & About
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "inquiries" ? "active" : ""}`}
              onClick={() => switchTab("inquiries")}
            >
              Inquiries ({stats.totalInquiries})
            </button>
            <button
              className={`cms-tab-btn ${activeTab === "audit" ? "active" : ""}`}
              onClick={() => switchTab("audit")}
            >
              Security Audit
            </button>
          </div>

          {/* CONTENT TABS */}
          {loading ? (
            <div className="cms-loading-box">
              <div className="spinner"></div>
              <p>Synchronizing central administrative registry...</p>
            </div>
          ) : (
            <div>
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="cms-tab-content">
                  <div className="stats-cards">
                    <div className="card highlight">
                      <h3>Total Registered Students</h3>
                      <p>{stats.totalStudents}</p>
                      <span className="card-sub">KYS Student Portal (Live)</span>
                    </div>
                    <div className="card">
                      <h3>Website Page Views</h3>
                      <p>{analytics.totalViews}</p>
                      <span className="card-sub">{analytics.uniqueVisitors} Unique Visitors</span>
                    </div>
                    <div className="card">
                      <h3>Leadership Officers</h3>
                      <p>{stats.totalLeaders}</p>
                      <span className="card-sub">Active Executive Profiles</span>
                    </div>
                    <div className="card">
                      <h3>Published Releases</h3>
                      <p>{stats.approvedNews}</p>
                      <span className="card-sub">{stats.pendingNews} Pending Review</span>
                    </div>
                  </div>

                  {/* Quick Action Cards */}
                  <div className="analytics-grid-2">
                    <div className="analytics-card">
                      <div className="analytics-card-header">
                        <h3>Leadership & Appointees</h3>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button onClick={openAddAppointeeModal} className="cms-btn-primary" style={{ padding: "7px 12px", fontSize: "0.82rem", margin: 0, backgroundColor: "#15803d" }}>
                            <FaUserTie /> + Appointee
                          </button>
                          <button onClick={openAddLeaderModal} className="cms-btn-secondary" style={{ padding: "7px 12px", fontSize: "0.82rem", margin: 0 }}>
                            <FaPlus /> + Officer
                          </button>
                        </div>
                      </div>
                      <p style={{ color: "#64748b", fontSize: "0.92rem", lineHeight: "1.6" }}>
                        Manage executives, official appointees of the Office of the PRO, and all 6 Southwest State PROs. Profiles and picture uploads sync immediately to the About Us leadership directory.
                      </p>
                      <button onClick={() => switchTab("leadership")} className="cms-btn-secondary" style={{ marginTop: "16px" }}>
                        View Leadership Roster →
                      </button>
                    </div>

                    <div className="analytics-card">
                      <div className="analytics-card-header">
                        <h3>Student Verification Registry (KYS)</h3>
                        <button onClick={() => switchTab("kys")} className="cms-btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem", margin: 0 }}>
                          Manage Students →
                        </button>
                      </div>
                      <p style={{ color: "#64748b", fontSize: "0.92rem", lineHeight: "1.6" }}>
                        All student registrations across Lagos, Ogun, Oyo, Osun, Ondo, and Ekiti are directly controlled here. Verify credentials, check bursary data, or print student slips.
                      </p>
                      <button onClick={() => switchTab("kys")} className="cms-btn-secondary" style={{ marginTop: "16px" }}>
                        Open KYS Directory →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ANALYTICS & TRAFFIC */}
              {activeTab === "analytics" && (
                <div className="cms-tab-content">
                  <div className="stats-cards">
                    <div className="card highlight">
                      <h3>Total Website Hits</h3>
                      <p>{analytics.totalViews}</p>
                      <span className="card-sub">All Tracked Sessions</span>
                    </div>
                    <div className="card">
                      <h3>Unique Visitors</h3>
                      <p>{analytics.uniqueVisitors}</p>
                      <span className="card-sub">Distinct IP Addresses</span>
                    </div>
                    <div className="card">
                      <h3>Today's Views</h3>
                      <p>{analytics.todayViews}</p>
                      <span className="card-sub">Last 24 Hours</span>
                    </div>
                    <div className="card">
                      <h3>7-Day Traffic</h3>
                      <p>{analytics.weekViews}</p>
                      <span className="card-sub">Past 7 Days</span>
                    </div>
                  </div>

                  <div className="analytics-grid-2">
                    {/* Geographic Distribution */}
                    <div className="analytics-card">
                      <div className="analytics-card-header">
                        <h3>Visitor Locations (Southwest & Nigeria)</h3>
                        <span style={{ fontSize: "0.8rem", color: "#15803d", fontWeight: "700" }}>Live GeoIP</span>
                      </div>
                      <div className="analytics-bar-list">
                        {analytics.topRegions && analytics.topRegions.length > 0 ? (
                          analytics.topRegions.map((reg, idx) => {
                            const maxCount = analytics.topRegions[0]?.count || 1;
                            const pct = Math.round((reg.count / maxCount) * 100);
                            return (
                              <div key={idx} className="analytics-bar-item">
                                <div className="analytics-bar-labels">
                                  <span>{reg.state} State</span>
                                  <span>{reg.count} visits ({pct}%)</span>
                                </div>
                                <div className="analytics-bar-track">
                                  <div className="analytics-bar-fill" style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No regional visit data recorded yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Top Visited Pages */}
                    <div className="analytics-card">
                      <div className="analytics-card-header">
                        <h3>Top Visited Pages</h3>
                        <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>URL Frequency</span>
                      </div>
                      <div className="analytics-bar-list">
                        {analytics.topPages && analytics.topPages.length > 0 ? (
                          analytics.topPages.map((pg, idx) => {
                            const maxPage = analytics.topPages[0]?.views || 1;
                            const pct = Math.round((pg.views / maxPage) * 100);
                            return (
                              <div key={idx} className="analytics-bar-item">
                                <div className="analytics-bar-labels">
                                  <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{pg.page}</span>
                                  <span>{pg.views} views</span>
                                </div>
                                <div className="analytics-bar-track">
                                  <div className="analytics-bar-fill gold" style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No page views logged yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Device Breakdown */}
                  <div className="analytics-card" style={{ marginBottom: "24px" }}>
                    <div className="analytics-card-header">
                      <h3>Visitor Device Breakdown</h3>
                    </div>
                    <div className="analytics-device-grid">
                      {analytics.devices && analytics.devices.length > 0 ? (
                        analytics.devices.map((d, i) => (
                          <div key={i} className="analytics-device-card">
                            <h4>{d.device}</h4>
                            <p>{d.count} <span style={{ fontSize: "0.85rem", fontWeight: "normal", color: "#64748b" }}>views</span></p>
                          </div>
                        ))
                      ) : (
                        <div className="analytics-device-card">
                          <h4>Desktop / Mobile</h4>
                          <p>{analytics.totalViews}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity Log */}
                  <div className="analytics-card">
                    <div className="analytics-card-header">
                      <h3>Recent Visitor Activity Stream</h3>
                      <span style={{ fontSize: "0.8rem", color: "#15803d", fontWeight: "700" }}>● Real-time</span>
                    </div>
                    <div className="cms-table-wrapper" style={{ boxShadow: "none", border: "none", margin: 0 }}>
                      <table className="cms-table">
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Page Accessed</th>
                            <th>Device</th>
                            <th>Browser / OS</th>
                            <th>Resolved Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.recentVisits && analytics.recentVisits.length > 0 ? (
                            analytics.recentVisits.map((v, i) => (
                              <tr key={i}>
                                <td>{new Date(v.createdAt).toLocaleTimeString()}</td>
                                <td><code style={{ color: "#15803d" }}>{v.page}</code></td>
                                <td>{v.device}</td>
                                <td>{v.browser} on {v.os}</td>
                                <td><strong>{v.region || v.city || "Southwest Zone D"}</strong>, {v.country}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" style={{ textAlign: "center", color: "#94a3b8" }}>
                                Waiting for incoming visitor traffic...
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LEADERSHIP DIRECTORY & APPOINTEES */}
              {activeTab === "leadership" && (() => {
                const appointeesCount = leaders.filter(checkIsAppointee).length;
                const executivesCount = leaders.filter(checkIsExecutive).length;
                const stateProsCount = leaders.filter(checkIsStatePro).length;

                const filteredLeaders = leaders
                  .filter((l) => {
                    if (leadershipFilter === "appointees" && !checkIsAppointee(l)) return false;
                    if (leadershipFilter === "executives" && !checkIsExecutive(l)) return false;
                    if (leadershipFilter === "statePros" && !checkIsStatePro(l)) return false;
                    if (leadershipSearch) {
                      const q = leadershipSearch.toLowerCase();
                      const matchName = l.fullName?.toLowerCase().includes(q);
                      const matchPos = l.position?.toLowerCase().includes(q);
                      const matchState = l.state?.toLowerCase().includes(q);
                      return matchName || matchPos || matchState;
                    }
                    return true;
                  })
                  .sort((a, b) => (Number(a.displayPriority) || 0) - (Number(b.displayPriority) || 0));

                return (
                  <div className="cms-tab-content">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
                      <div>
                        <h2>Leadership & Appointees Directory</h2>
                        <p className="form-tip">Manage all leadership profiles, state PROs, and arrange the hierarchy/order of how they appear on the live site.</p>
                      </div>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => openHierarchyModal(leadershipFilter === "all" ? "appointees" : leadershipFilter)}
                          className="cms-btn-secondary"
                          style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1.5px solid #15803d", color: "#15803d", fontWeight: "700" }}
                        >
                          <FaSortAmountDown /> Arrange Hierarchy / Order
                        </button>
                        <button
                          onClick={openAddAppointeeModal}
                          className="cms-btn-primary"
                          style={{ backgroundColor: "#15803d", display: "inline-flex", alignItems: "center", gap: "8px" }}
                        >
                          <FaUserTie /> + Add Office Appointee
                        </button>
                        <button
                          onClick={openAddLeaderModal}
                          className="cms-btn-secondary"
                          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                        >
                          <FaPlus /> + Add Other Officer
                        </button>
                      </div>
                    </div>

                    {/* Filter & Search Toolbar */}
                    <div style={{ background: "#ffffff", padding: "14px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "20px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => setLeadershipFilter("all")}
                          className={`action-btn ${leadershipFilter === "all" ? "verify" : ""}`}
                          style={{ padding: "6px 14px", borderRadius: "8px", fontWeight: "600", fontSize: "0.85rem" }}
                        >
                          All ({leaders.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadershipFilter("appointees")}
                          className={`action-btn ${leadershipFilter === "appointees" ? "verify" : ""}`}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "8px",
                            fontWeight: "700",
                            fontSize: "0.85rem",
                            backgroundColor: leadershipFilter === "appointees" ? "#15803d" : "#f0fdf4",
                            color: leadershipFilter === "appointees" ? "#ffffff" : "#166534",
                            border: "1px solid #86efac"
                          }}
                        >
                          ⭐ Office Appointees ({appointeesCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadershipFilter("executives")}
                          className={`action-btn ${leadershipFilter === "executives" ? "verify" : ""}`}
                          style={{ padding: "6px 14px", borderRadius: "8px", fontWeight: "600", fontSize: "0.85rem" }}
                        >
                          Executives ({executivesCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadershipFilter("statePros")}
                          className={`action-btn ${leadershipFilter === "statePros" ? "verify" : ""}`}
                          style={{ padding: "6px 14px", borderRadius: "8px", fontWeight: "600", fontSize: "0.85rem" }}
                        >
                          State JCC PROs ({stateProsCount})
                        </button>
                      </div>

                      <div style={{ minWidth: "220px", flex: 1, maxWidth: "320px" }}>
                        <input
                          type="text"
                          placeholder="Search name, position, state..."
                          value={leadershipSearch}
                          onChange={(e) => setLeadershipSearch(e.target.value)}
                          style={{ width: "100%", padding: "7px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px", outline: "none", fontSize: "0.85rem" }}
                        />
                      </div>
                    </div>

                    <div className="cms-table-wrapper">
                      <table className="cms-table">
                        <thead>
                          <tr>
                            <th>Photo</th>
                            <th>Officer Name</th>
                            <th>Official Position</th>
                            <th>Category / Classification</th>
                            <th>State / Coverage</th>
                            <th title="Lower number displays first">Display Hierarchy</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLeaders.length > 0 ? (
                            filteredLeaders.map((leader, leaderIdx) => {
                              const photoSrc = leader.photo || fallbackPhotoMap[leader.fullName] || proImage;
                              const isApp = checkIsAppointee(leader);
                              return (
                                <tr key={leader._id}>
                                  <td>
                                    <img
                                      src={photoSrc}
                                      alt={leader.fullName}
                                      onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = nansLogo;
                                      }}
                                      className="table-officer-photo"
                                    />
                                  </td>
                                  <td>
                                    <strong>{leader.fullName}</strong>
                                    {isApp && (
                                      <span style={{ marginLeft: "8px", background: "#dcfce7", color: "#166534", border: "1px solid #86efac", fontSize: "0.72rem", padding: "2px 7px", borderRadius: "4px", fontWeight: "700" }}>
                                        Office Appointee
                                      </span>
                                    )}
                                    {leader.isFeatured && (
                                      <span style={{ marginLeft: "6px", background: "#fef08a", color: "#854d0e", fontSize: "0.72rem", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>
                                        Featured
                                      </span>
                                    )}
                                  </td>
                                  <td>{leader.position}</td>
                                  <td>
                                    <span style={{ background: isApp ? "#f0fdf4" : "#f1f5f9", color: isApp ? "#15803d" : "#334155", padding: "4px 8px", borderRadius: "6px", fontSize: "0.82rem", fontWeight: "600", border: isApp ? "1px solid #bbf7d0" : "none" }}>
                                      {leader.category}
                                    </span>
                                  </td>
                                  <td>{leader.state}</td>
                                  <td style={{ minWidth: "120px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      <input
                                        type="number"
                                        defaultValue={leader.displayPriority || 0}
                                        key={leader.displayPriority}
                                        onBlur={(e) => {
                                          const val = parseInt(e.target.value, 10);
                                          if (!isNaN(val) && val !== leader.displayPriority) {
                                            handleUpdatePriority(leader._id, val);
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.target.blur();
                                          }
                                        }}
                                        title="Click and type to change rank (Enter to save)"
                                        style={{
                                          width: "44px",
                                          padding: "4px 6px",
                                          border: "1.5px solid #cbd5e1",
                                          borderRadius: "6px",
                                          textAlign: "center",
                                          fontWeight: "700",
                                          color: "#0f172a",
                                          fontSize: "0.84rem"
                                        }}
                                      />
                                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                        <button
                                          type="button"
                                          onClick={() => handleQuickMove(leader, -1, filteredLeaders)}
                                          disabled={leaderIdx === 0}
                                          title="Move Higher in Hierarchy"
                                          style={{
                                            background: "#f1f5f9",
                                            border: "1px solid #cbd5e1",
                                            borderRadius: "3px",
                                            cursor: leaderIdx === 0 ? "not-allowed" : "pointer",
                                            opacity: leaderIdx === 0 ? 0.3 : 1,
                                            padding: "2px 5px",
                                            lineHeight: "1",
                                            fontSize: "0.65rem",
                                            color: "#15803d"
                                          }}
                                        >
                                          ▲
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleQuickMove(leader, 1, filteredLeaders)}
                                          disabled={leaderIdx === filteredLeaders.length - 1}
                                          title="Move Lower in Hierarchy"
                                          style={{
                                            background: "#f1f5f9",
                                            border: "1px solid #cbd5e1",
                                            borderRadius: "3px",
                                            cursor: leaderIdx === filteredLeaders.length - 1 ? "not-allowed" : "pointer",
                                            opacity: leaderIdx === filteredLeaders.length - 1 ? 0.3 : 1,
                                            padding: "2px 5px",
                                            lineHeight: "1",
                                            fontSize: "0.65rem",
                                            color: "#15803d"
                                          }}
                                        >
                                          ▼
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                      <button onClick={() => openEditLeaderModal(leader)} className="action-btn" title="Edit Profile">
                                        <FaEdit />
                                      </button>
                                      <button onClick={() => handleDeleteLeader(leader._id)} className="action-btn delete" title="Delete Profile">
                                        <FaTrash />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                {leadershipFilter === "appointees"
                                  ? "No appointees found. Click '+ Add Office Appointee' to register one."
                                  : "No leadership profiles found matching current filter."}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 4: KYS STUDENT RECORDS */}
              {activeTab === "kys" && (
                <div className="cms-tab-content">
                  <div className="stats-cards" style={{ marginBottom: "24px" }}>
                    <div className="card highlight">
                      <h3>Total Registered Students</h3>
                      <p>{kysStatsDetail?.total || stats.totalStudents}</p>
                      <span className="card-sub">Southwest Nigerian Tertiary Institutions</span>
                    </div>
                    <div className="card">
                      <h3>Verified Students</h3>
                      <p>{kysStatsDetail?.verified || 0}</p>
                      <span className="card-sub">Identity & Enrollment Approved</span>
                    </div>
                    <div className="card">
                      <h3>Pending Verification</h3>
                      <p>{kysStatsDetail?.pending || 0}</p>
                      <span className="card-sub">Awaiting Administrative Review</span>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "20px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: "260px" }}>
                      <input
                        type="text"
                        placeholder="Search student by Name, Reg ID, Matric No, or Email..."
                        value={kysSearch}
                        onChange={(e) => {
                          setKysSearch(e.target.value);
                          fetchKysStudents(e.target.value);
                        }}
                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #cbd5e1", borderRadius: "8px", outline: "none" }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>State:</label>
                      <select 
                        value={kysStateFilter} 
                        onChange={(e) => setKysStateFilter(e.target.value)}
                        style={{ padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                      >
                        <option value="All">All States</option>
                        {SOUTHWEST_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Status:</label>
                      <select 
                        value={kysStatusFilter} 
                        onChange={(e) => setKysStatusFilter(e.target.value)}
                        style={{ padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Verified">Verified</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  {/* Students Table */}
                  <div className="cms-table-wrapper">
                    <table className="cms-table">
                      <thead>
                        <tr>
                          <th>Registration ID</th>
                          <th>Student Name</th>
                          <th>Institution</th>
                          <th>Course & Level</th>
                          <th>Origin State</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kysLoading ? (
                          <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>Loading students...</td>
                          </tr>
                        ) : filteredStudents.length > 0 ? (
                          filteredStudents.map((st) => (
                            <tr key={st._id}>
                              <td>
                                <strong style={{ color: "#15803d", fontFamily: "monospace" }}>{st.registrationId}</strong>
                              </td>
                              <td>
                                <strong>{st.fullName}</strong>
                                <br />
                                <small style={{ color: "#64748b" }}>{st.email}</small>
                              </td>
                              <td style={{ maxWidth: "200px" }}>{st.institution}</td>
                              <td>{st.course} ({st.level} Lvl)</td>
                              <td>{st.stateOrigin}</td>
                              <td>
                                <span className={`status-pill ${st.verificationStatus === "Verified" ? "verified" : "pending"}`}>
                                  {st.verificationStatus || "Pending"}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <button
                                    onClick={() => handleKysVerifyToggle(st._id, st.verificationStatus)}
                                    className={`action-btn ${st.verificationStatus === "Verified" ? "unverify" : "verify"}`}
                                  >
                                    {st.verificationStatus === "Verified" ? "Set Pending" : "Approve"}
                                  </button>
                                  <button
                                    onClick={() => setSelectedStudent(st)}
                                    className="action-btn"
                                    title="View Full Profile & Slip"
                                  >
                                    <FaEye />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                              No students found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: BLOGGER MANAGEMENT (Admin Restricted) */}
              {activeTab === "bloggers" && (
                <div className="cms-tab-content">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div>
                      <h2>Blogger & Press Contributor Management</h2>
                      <p className="form-tip">Only Central Administration can create and authorize blogger accounts for publishing news and releases.</p>
                    </div>
                    <button onClick={() => setShowBloggerModal(true)} className="cms-btn-primary">
                      <FaPlus /> Create New Blogger
                    </button>
                  </div>

                  <div className="blogger-grid">
                    {bloggers.length > 0 ? (
                      bloggers.map((b) => (
                        <div key={b._id} className="blogger-user-card">
                          <div>
                            <div className="blogger-card-header">
                              <div className="blogger-avatar-circle">
                                {b.name ? b.name.charAt(0).toUpperCase() : "B"}
                              </div>
                              <div className="blogger-name-title">
                                <h4>{b.name}</h4>
                                <p>{b.email}</p>
                              </div>
                            </div>
                            <div className="blogger-card-body">
                              <p>{b.bio || "Press contributor authorized to draft and submit reports for the Office of the PRO."}</p>
                              <div>
                                <span className={`status-pill ${b.status === "suspended" ? "rejected" : "verified"}`}>
                                  {b.status === "suspended" ? "Suspended" : "Active Contributor"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="blogger-card-actions">
                            <button
                              onClick={() => handleToggleBlogger(b._id)}
                              className={`action-btn ${b.status === "suspended" ? "verify" : "unverify"}`}
                              style={{ flex: 1 }}
                            >
                              {b.status === "suspended" ? "Reactivate" : "Suspend"}
                            </button>
                            <button
                              onClick={() => handleDeleteBlogger(b._id, b.name)}
                              className="action-btn delete"
                              title="Delete Blogger"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: "#64748b", padding: "20px" }}>No bloggers registered yet. Click "Create New Blogger" to provision an account.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: HOMEPAGE CMS */}
              {activeTab === "homepage" && (
                <div className="cms-tab-content">
                  <form onSubmit={handleSaveHomepage} className="cms-form-card">
                    <h2>Homepage Dynamic Hero & Content</h2>
                    <p className="form-tip">Configure main titles, descriptions, and CTA buttons on the public homepage.</p>

                    <div className="cms-field">
                      <label>Hero Title</label>
                      <input
                        type="text"
                        value={homepageForm.hero?.title || ""}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            hero: { ...homepageForm.hero, title: e.target.value }
                          })
                        }
                      />
                    </div>

                    <div className="cms-field">
                      <label>Hero Subtitle</label>
                      <input
                        type="text"
                        value={homepageForm.hero?.subtitle || ""}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            hero: { ...homepageForm.hero, subtitle: e.target.value }
                          })
                        }
                      />
                    </div>

                    <div className="cms-field">
                      <label>Hero Description</label>
                      <textarea
                        rows="3"
                        value={homepageForm.hero?.description || ""}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            hero: { ...homepageForm.hero, description: e.target.value }
                          })
                        }
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="cms-field">
                        <label>CTA Button Label</label>
                        <input
                          type="text"
                          value={homepageForm.hero?.ctaText || ""}
                          onChange={(e) =>
                            setHomepageForm({
                              ...homepageForm,
                              hero: { ...homepageForm.hero, ctaText: e.target.value }
                            })
                          }
                        />
                      </div>
                      <div className="cms-field">
                        <label>CTA Link Destination</label>
                        <input
                          type="text"
                          value={homepageForm.hero?.ctaLink || ""}
                          onChange={(e) =>
                            setHomepageForm({
                              ...homepageForm,
                              hero: { ...homepageForm.hero, ctaLink: e.target.value }
                            })
                          }
                        />
                      </div>
                    </div>

                    <button type="submit" className="save-cms-btn">
                      <FaSave /> Save Homepage Content
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 7: IDEALS & ABOUT */}
              {activeTab === "orginfo" && (
                <div className="cms-tab-content">
                  <form onSubmit={handleSaveOrgInfo} className="cms-form-card">
                    <h2>Organizational Vision, Mission & Ideals</h2>
                    <p className="form-tip">These values are published on the official About Us and institutional pages.</p>

                    <div className="cms-field">
                      <label>Institutional Vision</label>
                      <textarea
                        rows="3"
                        value={orgInfoForm.vision || ""}
                        onChange={(e) => setOrgInfoForm({ ...orgInfoForm, vision: e.target.value })}
                      />
                    </div>

                    <div className="cms-field">
                      <label>Institutional Mission</label>
                      <textarea
                        rows="3"
                        value={orgInfoForm.mission || ""}
                        onChange={(e) => setOrgInfoForm({ ...orgInfoForm, mission: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="save-cms-btn">
                      <FaSave /> Save Organizational Ideals
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 8: INQUIRIES */}
              {activeTab === "inquiries" && (
                <div className="cms-tab-content">
                  <h2>Student Complaints & Public Inquiries</h2>
                  <p className="form-tip">Direct messages sent via the public website contact portal.</p>

                  <div className="cms-table-wrapper">
                    <table className="cms-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Sender</th>
                          <th>Institution / Level</th>
                          <th>Message</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.length > 0 ? (
                          inquiries.map((inq) => (
                            <tr key={inq._id}>
                              <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                              <td>
                                <strong>{inq.fullName}</strong>
                                <br /><small>{inq.email || inq.phone}</small>
                              </td>
                              <td>{inq.school} ({inq.level})</td>
                              <td style={{ maxWidth: "280px" }}>{inq.message}</td>
                              <td>
                                <span className={`status-pill ${inq.status === "Resolved" ? "verified" : "pending"}`}>
                                  {inq.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  onClick={() => handleUpdateInquiry(inq._id, inq.status === "Resolved" ? "New" : "Resolved")}
                                  className={`action-btn ${inq.status === "Resolved" ? "unverify" : "verify"}`}
                                >
                                  {inq.status === "Resolved" ? "Reopen" : "Mark Resolved"}
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                              No inquiries submitted yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 9: AUDIT TRAIL */}
              {activeTab === "audit" && (
                <div className="cms-tab-content">
                  <h2>Security Action Audit Trail</h2>
                  <p className="form-tip">Tamper-evident logs of administrative activities, logins, and publishing.</p>

                  <div className="cms-table-wrapper">
                    <table className="cms-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Administrator</th>
                          <th>Action</th>
                          <th>Module</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.length > 0 ? (
                          auditLogs.map((log) => (
                            <tr key={log._id}>
                              <td>{new Date(log.createdAt).toLocaleString()}</td>
                              <td>{log.adminEmail}</td>
                              <td><code style={{ color: "#15803d" }}>{log.action}</code></td>
                              <td>{log.module}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                              No audit records logged yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              MODAL 1: ADD / EDIT LEADERSHIP PROFILE (Fixed Footer, Pure Solid White)
             ===================================================================== */}
          {showLeaderModal && (
            <div className="modal-backdrop" onClick={() => setShowLeaderModal(false)}>
              <div className="student-modal-card" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSaveLeader} style={{ display: "contents" }}>
                  <div className="modal-header">
                    <h3>
                      {editingLeaderId
                        ? (leaderForm.isAppointee ? "Edit Appointee Profile" : "Edit Leadership Profile")
                        : (leaderForm.isAppointee ? "Add Appointee — Office of the PRO" : "Add Leadership / Executive Profile")}
                    </h3>
                    <button type="button" className="close-btn" onClick={() => setShowLeaderModal(false)}>
                      <FaTimes />
                    </button>
                  </div>

                  <div className="modal-form-body">
                    {/* APPOINTEE OF OFFICE OF PRO TOGGLE BANNER */}
                    <div
                      style={{
                        background: (leaderForm.isAppointee || leaderForm.category === "Appointee" || leaderForm.category === "Appointee (Office of the PRO)") ? "#f0fdf4" : "#f8fafc",
                        border: (leaderForm.isAppointee || leaderForm.category === "Appointee" || leaderForm.category === "Appointee (Office of the PRO)") ? "1.5px solid #86efac" : "1px solid #e2e8f0",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        marginBottom: "16px"
                      }}
                    >
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0, cursor: "pointer", fontWeight: "700", color: (leaderForm.isAppointee || leaderForm.category === "Appointee" || leaderForm.category === "Appointee (Office of the PRO)") ? "#15803d" : "#334155", fontSize: "0.92rem" }}>
                        <input
                          type="checkbox"
                          checked={Boolean(leaderForm.isAppointee || leaderForm.category === "Appointee" || leaderForm.category === "Appointee (Office of the PRO)")}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setLeaderForm({
                              ...leaderForm,
                              isAppointee: checked,
                              category: checked && (leaderForm.category === "Executive" || leaderForm.category === "State PRO") ? "Appointee" : leaderForm.category
                            });
                          }}
                          style={{ width: "19px", height: "19px", accentColor: "#15803d" }}
                        />
                        <span>⭐ Appointee of the Office of the PRO (Displays in the dedicated Appointees section)</span>
                      </label>
                    </div>

                    <div className="form-grid-2">
                      <div className="cms-field">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Comrade Adebayo Smart"
                          value={leaderForm.fullName}
                          onChange={(e) => setLeaderForm({ ...leaderForm, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="cms-field">
                        <label>Official Position *</label>
                        <input
                          type="text"
                          placeholder={leaderForm.isAppointee ? "e.g. Senior Special Assistant to the PRO on Media" : "e.g. Director of Special Duties"}
                          value={leaderForm.position}
                          onChange={(e) => setLeaderForm({ ...leaderForm, position: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="cms-field">
                        <label>Category *</label>
                        <select
                          value={leaderForm.category}
                          onChange={(e) => {
                            const cat = e.target.value;
                            const isApp = cat === "Appointee" || cat === "Appointee (Office of the PRO)" || cat === "Special Assistant" || cat === "Senior Special Assistant" || cat === "Media Aide" || leaderForm.isAppointee;
                            setLeaderForm({ ...leaderForm, category: cat, isAppointee: isApp });
                          }}
                        >
                          <option value="Appointee">Appointee (Office of the PRO)</option>
                          <option value="Executive">Executive</option>
                          <option value="State PRO">State PRO (Southwest JCC)</option>
                          <option value="Special Assistant">Special Assistant</option>
                          <option value="Senior Special Assistant">Senior Special Assistant</option>
                          <option value="Director">Director</option>
                          <option value="Deputy Director">Deputy Director</option>
                          <option value="Media Aide">Media Aide</option>
                          <option value="Media Team">Media Team</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="cms-field">
                        <label>State / Coverage</label>
                        <input
                          type="text"
                          placeholder="e.g. Lagos, Ogun, Oyo, Osun, Ondo, Ekiti, or Southwest Zone D"
                          value={leaderForm.state}
                          onChange={(e) => setLeaderForm({ ...leaderForm, state: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* PHOTOGRAPH UPLOAD */}
                    <div className="cms-field">
                      <label>Officer Photograph (Cloudinary Upload)</label>
                      
                      {leaderPhotoPreview ? (
                        <div className="image-preview-box">
                          <img 
                            src={leaderPhotoPreview} 
                            alt="Preview" 
                            className="image-preview-img"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = nansLogo;
                            }} 
                          />
                          <div className="image-preview-info">
                            <div className="image-preview-name">
                              {leaderPhotoFile ? leaderPhotoFile.name : "Current Photo Attached"}
                            </div>
                            <span className="image-preview-meta">Ready to save</span>
                          </div>
                          <button
                            type="button"
                            className="btn-remove-preview"
                            onClick={() => {
                              setLeaderPhotoFile(null);
                              setLeaderPhotoPreview("");
                              setLeaderForm({ ...leaderForm, photo: "" });
                            }}
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="image-upload-dropzone">
                          <FaCloudUploadAlt style={{ fontSize: "2rem", color: "#16a34a" }} />
                          <span style={{ fontWeight: "700", fontSize: "0.92rem", color: "#15803d" }}>
                            Click to Browse or Drag Image Here
                          </span>
                          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                            JPG, PNG, WEBP (Direct upload to Cloudinary)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                          />
                        </div>
                      )}
                    </div>

                    <div className="cms-field">
                      <label>Portfolio Responsibilities & Focus</label>
                      <textarea
                        rows="3"
                        placeholder="Outline key duties, scope of office, and student advocacy projects..."
                        value={leaderForm.portfolio}
                        onChange={(e) => setLeaderForm({ ...leaderForm, portfolio: e.target.value })}
                      />
                    </div>

                    <div className="cms-field">
                      <label>Officer Biography</label>
                      <textarea
                        rows="3"
                        placeholder="Brief personal background and leadership profile..."
                        value={leaderForm.biography}
                        onChange={(e) => setLeaderForm({ ...leaderForm, biography: e.target.value })}
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="cms-field">
                        <label>Display Priority (Lower appears first)</label>
                        <input
                          type="number"
                          value={leaderForm.displayPriority}
                          onChange={(e) => setLeaderForm({ ...leaderForm, displayPriority: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="cms-field" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "24px" }}>
                        <input
                          type="checkbox"
                          id="featured-check"
                          checked={leaderForm.isFeatured}
                          onChange={(e) => setLeaderForm({ ...leaderForm, isFeatured: e.target.checked })}
                          style={{ width: "20px", height: "20px", accentColor: "#15803d" }}
                        />
                        <label htmlFor="featured-check" style={{ margin: 0, cursor: "pointer", fontWeight: "600" }}>
                          Feature on Public Homepage
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="modal-form-footer">
                    <button 
                      type="button" 
                      className="cms-btn-secondary"
                      onClick={() => setShowLeaderModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="cms-btn-primary" 
                      disabled={leaderSubmitting}
                    >
                      {leaderSubmitting ? "Uploading & Saving..." : editingLeaderId ? "Update Profile" : (leaderForm.isAppointee ? "Publish Appointee Profile" : "Publish Leadership Profile")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* =====================================================================
              MODAL 2: CREATE BLOGGER ACCOUNT (Fixed Footer)
             ===================================================================== */}
          {showBloggerModal && (
            <div className="modal-backdrop" onClick={() => setShowBloggerModal(false)}>
              <div className="student-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
                <form onSubmit={handleCreateBlogger} style={{ display: "contents" }}>
                  <div className="modal-header">
                    <h3>Provision New Blogger Account</h3>
                    <button type="button" className="close-btn" onClick={() => setShowBloggerModal(false)}>
                      <FaTimes />
                    </button>
                  </div>

                  <div className="modal-form-body">
                    <div className="cms-field">
                      <label>Contributor Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Comrade Samuel Adeleke"
                        value={newBlogger.name}
                        onChange={(e) => setNewBlogger({ ...newBlogger, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="cms-field">
                      <label>Contributor Email Address *</label>
                      <input
                        type="email"
                        placeholder="blogger@officeoftheprozoned.com"
                        value={newBlogger.email}
                        onChange={(e) => setNewBlogger({ ...newBlogger, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="cms-field">
                      <label>Initial Password *</label>
                      <input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={newBlogger.password}
                        onChange={(e) => setNewBlogger({ ...newBlogger, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="cms-field">
                      <label>Editorial Bio / Campus Beat</label>
                      <textarea
                        rows="2"
                        placeholder="e.g. Lagos State Campus Correspondent"
                        value={newBlogger.bio}
                        onChange={(e) => setNewBlogger({ ...newBlogger, bio: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="modal-form-footer">
                    <button 
                      type="button" 
                      className="cms-btn-secondary"
                      onClick={() => setShowBloggerModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="cms-btn-primary" 
                      disabled={bloggerSubmitting}
                    >
                      {bloggerSubmitting ? "Creating..." : "Create Blogger Account"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* =====================================================================
              MODAL: ARRANGE HIERARCHY & DISPLAY ORDER
             ===================================================================== */}
          {showHierarchyModal && (
            <div className="modal-backdrop" onClick={() => setShowHierarchyModal(false)}>
              <div className="student-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px" }}>
                <div className="modal-header">
                  <div>
                    <h3>Arrange Leadership & Appointees Hierarchy</h3>
                    <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#64748b" }}>
                      Control the ranking order. Position #1 displays first at the top of the frontend leadership page.
                    </p>
                  </div>
                  <button type="button" className="close-btn" onClick={() => setShowHierarchyModal(false)}>
                    <FaTimes />
                  </button>
                </div>

                <div className="modal-form-body">
                  <div className="hierarchy-container">
                    {/* Category tabs */}
                    <div className="hierarchy-tabs">
                      <button
                        type="button"
                        onClick={() => switchHierarchyCategory("appointees")}
                        className={`hierarchy-tab-btn ${hierarchyCategory === "appointees" ? "active" : ""}`}
                      >
                        ⭐ Office Appointees ({leaders.filter(checkIsAppointee).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => switchHierarchyCategory("executives")}
                        className={`hierarchy-tab-btn ${hierarchyCategory === "executives" ? "active" : ""}`}
                      >
                        Executive Leadership ({leaders.filter(checkIsExecutive).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => switchHierarchyCategory("statePros")}
                        className={`hierarchy-tab-btn ${hierarchyCategory === "statePros" ? "active" : ""}`}
                      >
                        State JCC PROs ({leaders.filter(checkIsStatePro).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => switchHierarchyCategory("all")}
                        className={`hierarchy-tab-btn ${hierarchyCategory === "all" ? "active" : ""}`}
                      >
                        All Members ({leaders.length})
                      </button>
                    </div>

                    {/* Reorderable List */}
                    <div className="hierarchy-list">
                      {hierarchyList.length > 0 ? (
                        hierarchyList.map((item, index) => {
                          const photoSrc = item.photo || fallbackPhotoMap[item.fullName] || proImage;
                          const isTop = index === 0;
                          const isBottom = index === hierarchyList.length - 1;

                          return (
                            <div key={item._id} className={`hierarchy-item ${isTop ? "rank-first" : ""}`}>
                              <div className="hierarchy-left">
                                <span className={`hierarchy-rank-badge ${isTop ? "top-rank" : ""}`}>
                                  #{index + 1}
                                </span>
                                <img
                                  src={photoSrc}
                                  alt={item.fullName}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = nansLogo;
                                  }}
                                  className="hierarchy-item-photo"
                                />
                                <div className="hierarchy-item-text">
                                  <span className="hierarchy-item-name">{item.fullName}</span>
                                  <span className="hierarchy-item-pos">{item.position}</span>
                                </div>
                              </div>

                              <div className="hierarchy-controls">
                                <button
                                  type="button"
                                  onClick={() => moveHierarchyItem(index, -1)}
                                  disabled={isTop}
                                  className="hierarchy-btn"
                                  title="Move Higher in Hierarchy"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveHierarchyItem(index, 1)}
                                  disabled={isBottom}
                                  className="hierarchy-btn"
                                  title="Move Lower in Hierarchy"
                                >
                                  ▼
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                          No profiles found in this category.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-form-footer">
                  <button
                    type="button"
                    className="cms-btn-secondary"
                    onClick={() => setShowHierarchyModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="cms-btn-primary"
                    disabled={hierarchySaving || hierarchyList.length === 0}
                    onClick={saveHierarchyOrder}
                  >
                    {hierarchySaving ? "Saving Hierarchy..." : "Save Hierarchy Order"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              MODAL 3: VIEW STUDENT DETAILS & VERIFICATION SLIP
             ===================================================================== */}
          {selectedStudent && (
            <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
              <div className="student-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
                <div className="modal-header">
                  <h3>KYS Student Registration Record</h3>
                  <button type="button" className="close-btn" onClick={() => setSelectedStudent(null)}>
                    <FaTimes />
                  </button>
                </div>

                <div className="modal-form-body">
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "16px", borderRadius: "10px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#166534", textTransform: "uppercase" }}>Registration ID</span>
                      <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#052e16", fontFamily: "monospace" }}>
                        {selectedStudent.registrationId}
                      </div>
                    </div>
                    <span className={`status-pill ${selectedStudent.verificationStatus === "Verified" ? "verified" : "pending"}`}>
                      {selectedStudent.verificationStatus || "Pending"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "10px" }}>
                    <div>
                      <small style={{ color: "#64748b", fontWeight: "600" }}>Full Name</small>
                      <div style={{ fontWeight: "700", color: "#1e293b" }}>{selectedStudent.fullName}</div>
                    </div>
                    <div>
                      <small style={{ color: "#64748b", fontWeight: "600" }}>Institution</small>
                      <div style={{ fontWeight: "700", color: "#1e293b" }}>{selectedStudent.institution}</div>
                    </div>
                    <div>
                      <small style={{ color: "#64748b", fontWeight: "600" }}>Course of Study</small>
                      <div style={{ fontWeight: "700", color: "#1e293b" }}>{selectedStudent.course}</div>
                    </div>
                    <div>
                      <small style={{ color: "#64748b", fontWeight: "600" }}>Academic Level</small>
                      <div style={{ fontWeight: "700", color: "#1e293b" }}>{selectedStudent.level} Level</div>
                    </div>
                    <div>
                      <small style={{ color: "#64748b", fontWeight: "600" }}>State of Origin</small>
                      <div style={{ fontWeight: "700", color: "#1e293b" }}>{selectedStudent.stateOrigin} ({selectedStudent.lgaOrigin})</div>
                    </div>
                    <div>
                      <small style={{ color: "#64748b", fontWeight: "600" }}>Phone / WhatsApp</small>
                      <div style={{ fontWeight: "700", color: "#1e293b" }}>{selectedStudent.phone}</div>
                    </div>
                    <div>
                      <small style={{ color: "#64748b", fontWeight: "600" }}>Email Address</small>
                      <div style={{ fontWeight: "700", color: "#1e293b" }}>{selectedStudent.email}</div>
                    </div>
                    <div>
                      <small style={{ color: "#64748b", fontWeight: "600" }}>Bursary Status</small>
                      <div style={{ fontWeight: "700", color: "#1e293b" }}>
                        {selectedStudent.receivedBursary ? "Previously Received" : "Never Received"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-form-footer">
                  <button
                    type="button"
                    onClick={() => {
                      handleKysVerifyToggle(selectedStudent._id, selectedStudent.verificationStatus);
                      setSelectedStudent(null);
                    }}
                    className={`action-btn ${selectedStudent.verificationStatus === "Verified" ? "unverify" : "verify"}`}
                    style={{ padding: "10px 18px", fontSize: "0.88rem" }}
                  >
                    {selectedStudent.verificationStatus === "Verified" ? "Set to Pending" : "Approve & Verify"}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.open(`/verify-status?id=${selectedStudent.registrationId}`, "_blank")}
                    className="cms-btn-secondary"
                    style={{ padding: "10px 18px" }}
                  >
                    <FaExternalLinkAlt /> Open Verification Slip ↗
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
