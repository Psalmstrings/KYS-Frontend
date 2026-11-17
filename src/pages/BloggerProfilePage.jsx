import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaNewspaper, FaCheckCircle, FaHourglassHalf, FaPlusCircle, FaSignOutAlt } from "react-icons/fa";
import "../styles/bloggerProfile.css";
import Sidebar from "../components/BloggerSideBar";
import Navbar from "../components/BloggerNavbar";

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";

export default function BloggerProfile() {
  const [blogger, setBlogger] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBloggerData();
  }, []);

  const fetchBloggerData = async () => {
    setLoading(true);
    try {
      // 1. Get cached user or fallback
      const cached = localStorage.getItem("blogger_user");
      let currentBlogger = cached ? JSON.parse(cached) : null;

      if (!currentBlogger) {
        currentBlogger = {
          name: "Press Contributor",
          email: "blogger@officeoftheprozoned.com",
          bio: "Official NANS Southwest Zone D Media & Press Contributor."
        };
      }
      setBlogger(currentBlogger);

      // 2. Fetch real news articles
      const token = localStorage.getItem("blogger_token") || localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/news/headlines`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(res.data)) {
        setNews(res.data);
      } else if (Array.isArray(res.data?.headlines)) {
        setNews(res.data.headlines);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error("Error fetching blogger dashboard data:", err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const totalNews = news.length;
  const approvedNews = news.filter(n => n.approved || n.isApproved).length;
  const pendingNews = totalNews - approvedNews;

  return (
    <div>
      <Navbar />
      <div className="section">
        <Sidebar />
        <div className="blogger-profile container">
          {/* Profile Header Card */}
          <div className="profile-header">
            <div className="profile-avatar-wrap">
              {blogger?.avatar ? (
                <img src={blogger.avatar} alt={blogger.name} className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  <FaUserCircle />
                </div>
              )}
            </div>

            <div className="profile-info">
              <span className="profile-role-badge">Official Press Contributor</span>
              <h1>{blogger?.name || "Press Contributor"}</h1>
              <p className="email">{blogger?.email || "blogger@officeoftheprozoned.com"}</p>
              <p className="bio">
                {blogger?.bio || "Media contributor actively covering campus events, student welfare developments, and executive releases across Southwest Zone D."}
              </p>

              <div className="profile-stats">
                <span><FaNewspaper /> Total Articles: {totalNews}</span>
                <span className="stat-approved"><FaCheckCircle /> Approved: {approvedNews}</span>
                <span className="stat-pending"><FaHourglassHalf /> Pending: {pendingNews}</span>
              </div>
            </div>

            <div className="profile-actions-col">
              <Link to="/create/news" className="btn-create-news-link">
                <FaPlusCircle /> Write New Story
              </Link>
            </div>
          </div>

          {/* Blogger's News List */}
          <section className="blogger-news">
            <div className="blogger-news-header">
              <h2>Recent Articles & Submissions</h2>
              <Link to="/news-management" className="view-all-manage-link">
                Manage All Articles →
              </Link>
            </div>

            {loading ? (
              <p className="loading-text">Loading news records...</p>
            ) : news.length === 0 ? (
              <div className="no-news-blogger-box">
                <p>No articles submitted yet.</p>
                <Link to="/create/news" className="btn-create-news-link">
                  <FaPlusCircle /> Publish Your First Story
                </Link>
              </div>
            ) : (
              <ul className="news-list">
                {news.slice(0, 10).map((n) => {
                  const isAppr = n.approved || n.isApproved;
                  return (
                    <li key={n._id} className={isAppr ? "approved" : "pending"}>
                      <div className="news-item-left">
                        <span className="news-title">{n.title}</span>
                        <span className="news-meta-date">
                          {new Date(n.createdAt || Date.now()).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <span className={`news-status ${isAppr ? "approved" : "pending"}`}>
                        {isAppr ? "Approved & Live" : "Pending Approval"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
