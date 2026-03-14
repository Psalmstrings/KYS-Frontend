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

  // Edit news - redirect to edit page
  // const editNews = (id) => {
  //   window.location.href = `/edit-news/${id}`;
  // };

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
                      <button >Edit</button>
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
      </div>
    </div>
  );
};

export default BloggerNewsManagement;