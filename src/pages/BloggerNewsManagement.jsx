import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import "../styles/admindash.css";
import Navbar from "../components/BloggerNavbar";
import Sidebar from "../components/BloggerSideBar";

const API_URL = import.meta.env.VITE_API; 

const BloggerNewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // Fetch headlines
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/news/headlines`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (Array.isArray(response.data)) {
        setNews(response.data);
      } else if (Array.isArray(response.data.headlines)) {
        setNews(response.data.headlines);
      } else {
        setNews([]);
        console.warn("Unexpected response format:", response.data);
      }

      console.log("Fetched headlines:", response.data);
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
    if (!window.confirm("Are you sure you want to delete this news?")) return;
    try {
      await axios.delete(`${API_URL}/news/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("News deleted");
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
  try {
    await axios.put(
      `${API_URL}/news/${currentNews._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          <h2>News Management</h2>

          {loading ? (
            <p>Loading headlines...</p>
          ) : news.length === 0 ? (
            <p>No news posted yet.</p>
          ) : (
            <table className="news-table">
              <thead>
                <tr>
                  <th>News Title</th>
                  <th>Blogger</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n._id}>
                    <td>{n.title}</td>
                    <td>{n.author?.name || "Unknown"}</td>
                    <td>{n.approved ? "Approved" : "Pending"}</td>
                    <td>
                      <button onClick={() => handleEditClick(n)}>Edit</button>
                      <button
                        onClick={() => deleteNews(n._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit News</h3>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="News Title"
            />

            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="News Content"
            />

            <div className="modal-actions">
              <button onClick={handleUpdateNews}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
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