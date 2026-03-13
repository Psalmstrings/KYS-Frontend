import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import "../styles/admindash.css";

const API_URL = import.meta.env.BLOG_API_URL; // Make sure your .env has this

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch headlines from API
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/news/headlines`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Ensure we get an array
      if (Array.isArray(response.data)) {
        setNews(response.data);
      } else if (Array.isArray(response.data.headlines)) {
        setNews(response.data.headlines);
      } else {
        setNews([]);
        console.warn("Unexpected headlines response format:", response.data);
      }

      console.log("Fetched headlines:", response.data); // Debug log
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch headlines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Approve a headline (only if your API supports this)
  const approveNews = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/news/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("News approved");
      fetchNews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve news");
    }
  };

  // Delete a headline
  const deleteNews = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/news/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("News deleted");
      fetchNews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete news");
    }
  };

  return (
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
              <th>Title</th>
              <th>Blogger</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((n) => (
              <tr key={n._id}>
                <td>{n.title}</td>
                <td>{n.author}</td>
                <td>{n.approved ? "Approved" : "Pending"}</td>
                <td>
                  {!n.approved && (
                    <button onClick={() => approveNews(n._id)}>Approve</button>
                  )}
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
    </div>
  );
};

export default NewsManagement;