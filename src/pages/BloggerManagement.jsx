import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API; 

const BloggerManagement = () => {
  const [bloggers, setBloggers] = useState([]); // default to empty array
  const [loading, setLoading] = useState(false);

  const fetchBloggers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users/getusers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Ensure we always get an array
      if (Array.isArray(response.data)) {
        setBloggers(response.data);
      } else if (Array.isArray(response.data.bloggers)) {
        setBloggers(response.data.bloggers);
      } else {
        setBloggers([]);
        console.warn("Unexpected bloggers data format:", response.data);
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

  

  return (
    <div>
      <Navbar />
      <div className="section">
        <Sidebar />
        <div>
          <div className="dashboard-content">
      <h2>Blogger Management</h2>

      {loading ? (
        <p>Loading bloggers...</p>
      ) : bloggers.length === 0 ? (
        <p>No bloggers yet.</p>
      ) : (
        <table className="news-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bloggers.map((b) => (
              <tr key={b._id}>
                <td>{b.name}</td>
                <td>{b.email}</td>
                <td>{b.suspended ? "Suspended" : "Active"}</td>
                <td>
                  <button
                    onClick={() => toggleSuspend(b._id, b.suspended)} 
                    className={b.suspended ? "activate-btn" : "suspend-btn"}
                  >
                    View Details
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
    </div>
  );
};

export default BloggerManagement;