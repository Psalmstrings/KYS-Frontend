import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { FaEdit, FaTrash, FaPlus, FaNewspaper } from "react-icons/fa";
import "../styles/admindash.css";
import Navbar from "../components/BloggerNavbar";
import Sidebar from "../components/BloggerSideBar";

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api"; 

const BloggerNewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const getToken = () => localStorage.getItem("blogger_token") || localStorage.getItem("token");

  // Fetch headlines
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/news/headlines`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

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

  // Delete news
  const deleteNews = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) return;
    try {
      await axios.delete(`${API_URL}/news/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("News deleted successfully");
      fetchNews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete news");
    }
  };

  // Edit News
  const handleEditClick = (newsItem) => {
    setCurrentNews(newsItem);
    setFormData({
      title: newsItem.title || "",
      content: newsItem.content || "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateNews = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content cannot be empty.");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/news/${currentNews._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      toast.success("News updated successfully");
      setIsModalOpen(false);
      fetchNews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update news");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="section">
        <Sidebar />
        <div className="dashboard-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#052e16", margin: 0 }}>
                My Submitted Articles
              </h2>
              <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "0.95rem" }}>
                Review and update stories submitted to the official editorial pipeline.
              </p>
            </div>
            <Link to="/create/news" className="switch-portal-btn">
              <FaPlus /> Submit New Story
            </Link>
          </div>

          {loading ? (
            <p>Loading headlines...</p>
          ) : news.length === 0 ? (
            <div style={{ background: "#fff", padding: "40px", borderRadius: "12px", textAlign: "center", border: "1px solid #e5e7eb" }}>
              <p style={{ color: "#64748b", fontSize: "1.05rem", marginBottom: "16px" }}>No news submitted yet.</p>
              <Link to="/create/news" className="switch-portal-btn">
                <FaPlus /> Submit Your First Article
              </Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="news-table">
                <thead>
                  <tr>
                    <th>Article Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((n) => {
                    const isAppr = n.approved || n.isApproved;
                    return (
                      <tr key={n._id}>
                        <td><strong>{n.title}</strong></td>
                        <td>{n.category || "Press Release"}</td>
                        <td>
                          <span className={`status-pill ${isAppr ? "verified" : "pending"}`}>
                            {isAppr ? "Approved" : "Pending Review"}
                          </span>
                        </td>
                        <td style={{ color: "#64748b", fontSize: "0.85rem" }}>
                          {new Date(n.createdAt || Date.now()).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleEditClick(n)} className="action-btn view">
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => deleteNews(n._id)}
                              className="action-btn delete"
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
            </div>
          )}

          {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#052e16", marginBottom: "16px" }}>
                  Edit Story Content
                </h3>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "0.875rem", marginBottom: "6px" }}>
                    Article Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="News Title"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "0.875rem", marginBottom: "6px" }}>
                    Article Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="News Content"
                    rows="8"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", resize: "vertical" }}
                  />
                </div>

                <div className="modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button onClick={() => setIsModalOpen(false)} className="btn-modal-cancel">
                    Cancel
                  </button>
                  <button onClick={handleUpdateNews} className="btn-modal-save">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloggerNewsManagement;
