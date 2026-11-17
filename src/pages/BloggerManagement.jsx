import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaUserSlash, FaUserCheck, FaTrash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";

const BloggerManagement = () => {
  const [bloggers, setBloggers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("pro_admin_token") || localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchBloggers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users/getusers`, {
        headers: getAuthHeader(),
      });

      if (Array.isArray(response.data)) {
        setBloggers(response.data);
      } else if (Array.isArray(response.data.bloggers)) {
        setBloggers(response.data.bloggers);
      } else {
        setBloggers([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bloggers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloggers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const isSuspended = currentStatus === "suspended" || currentStatus === true;
    const endpoint = isSuspended ? `${API_URL}/users/reactivate/${id}` : `${API_URL}/users/suspend/${id}`;

    try {
      await axios.put(endpoint, {}, { headers: getAuthHeader() });
      toast.success(isSuspended ? "Blogger account reactivated" : "Blogger account suspended");
      fetchBloggers();
    } catch (err) {
      toast.error("Failed to update blogger status");
    }
  };

  const handleDeleteBlogger = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this blogger account?")) return;
    try {
      await axios.delete(`${API_URL}/auth/bloggers/${id}`, { headers: getAuthHeader() });
      toast.success("Blogger account deleted");
      fetchBloggers();
    } catch (err) {
      toast.error("Failed to delete blogger");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="section">
        <Sidebar />
        <div className="dashboard-content">
          <div style={{ marginBottom: "20px" }}>
            <h2>Blogger Team Management</h2>
            <p style={{ color: "#6b7280" }}>Manage media personnel and content contributors authorized to publish news.</p>
          </div>

          {loading ? (
            <p>Loading contributors...</p>
          ) : bloggers.length === 0 ? (
            <p>No bloggers registered yet.</p>
          ) : (
            <table className="news-table">
              <thead>
                <tr>
                  <th>Contributor Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bloggers.map((b) => {
                  const isSuspended = b.status === "suspended" || b.isSuspended === true;
                  return (
                    <tr key={b._id}>
                      <td><strong>{b.name}</strong></td>
                      <td>{b.email}</td>
                      <td>
                        <span className={`status-pill ${isSuspended ? "rejected" : "verified"}`}>
                          {isSuspended ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleToggleStatus(b._id, isSuspended)}
                            className={isSuspended ? "action-btn verify" : "action-btn unverify"}
                          >
                            {isSuspended ? <><FaUserCheck /> Reactivate</> : <><FaUserSlash /> Suspend</>}
                          </button>
                          <button
                            onClick={() => handleDeleteBlogger(b._id)}
                            className="delete-icon-btn"
                            title="Delete Blogger"
                          >
                            <FaTrash />
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

export default BloggerManagement;
