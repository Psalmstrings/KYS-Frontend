import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaCheck, FaTrash, FaExternalLinkAlt, FaPlus, FaNewspaper } from "react-icons/fa";
import "../styles/admindash.css";

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("pro_admin_token") || localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch headlines
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/news/headlines`);

      if (Array.isArray(response.data)) {
        setNews(response.data);
      } else if (Array.isArray(response.data.headlines)) {
        setNews(response.data.headlines);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch headlines");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Approve news
  const approveNews = async (id) => {
    try {
      await axios.put(
        `${API_URL}/news/${id}/approve`,
        {},
        { headers: getAuthHeader() }
      );
      toast.success("Article approved for publication");
      fetchNews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve news");
    }
  };

  // Delete news
  const deleteNews = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this article?")) return;
    try {
      await axios.delete(`${API_URL}/news/${id}`, {
        headers: getAuthHeader(),
      });
      toast.success("News article deleted");
      fetchNews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete news");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="section">
        <Sidebar />
        <div className="dashboard-content">
          <div className="tab-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2>News & Press Release Management</h2>
              <p style={{ color: "#6b7280" }}>Review, approve, and manage articles published on the official portal.</p>
            </div>
            <Link to="/create-news" className="create-btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <FaPlus /> Publish New Story
            </Link>
          </div>

          {loading ? (
            <p>Loading headlines...</p>
          ) : news.length === 0 ? (
            <p>No news posted yet.</p>
          ) : (
            <table className="news-table">
              <thead>
                <tr>
                  <th>News Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => {
                  const isApproved = n.isApproved === true || n.approved === true;
                  return (
                    <tr key={n._id}>
                      <td style={{ fontWeight: "500", maxWidth: "350px" }}>
                        <Link to={`/news/${n._id}`} target="_blank" rel="noopener noreferrer" style={{ color: "#166534", textDecoration: "none" }}>
                          {n.title} <FaExternalLinkAlt style={{ fontSize: "0.75rem", marginLeft: "4px" }} />
                        </Link>
                      </td>
                      <td>{n.author?.name || "Official Admin"}</td>
                      <td>{new Date(n.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-pill ${isApproved ? "verified" : "pending"}`}>
                          {isApproved ? "Approved" : "Pending Review"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {!isApproved && (
                            <button onClick={() => approveNews(n._id)} className="action-btn verify">
                              <FaCheck /> Approve
                            </button>
                          )}
                          <button
                            onClick={() => deleteNews(n._id)}
                            className="action-btn delete-btn"
                            style={{ background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsManagement;
