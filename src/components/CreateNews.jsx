import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import "../styles/createNews.css"; 
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api"; 

export default function CreateNews() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [category, setCategory] = useState("Press Release");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("pro_admin_token") || localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !category) {
      toast.error("Please fill in all required fields (Title, Category, Content)");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("isApproved", true);

      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      } else if (coverImageUrl.trim()) {
        formData.append("coverImage", coverImageUrl.trim());
      }

      await axios.post(`${API_URL}/news/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...getAuthHeader(),
        },
      });

      toast.success("News article published successfully!");
      setTitle("");
      setContent("");
      setCoverImageFile(null);
      setCoverImageUrl("");

      navigate("/admin/news");
    } catch (err) {
      console.error("Error creating news:", err);
      const msg = err.response?.data?.message || err.message || "Failed to publish news";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="section">
        <Sidebar />
        <div className="create-news-container">
          <h2>Publish News & Press Release</h2>
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            This story will be published directly to the official website and optimized for social sharing.
          </p>

          <form className="create-news-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Article Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling headline"
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                required
              >
                <option value="Press Release">Press Release</option>
                <option value="Student Welfare">Student Welfare</option>
                <option value="Events">Events & Summits</option>
                <option value="Partnership">Educational Partnership</option>
                <option value="General">General News</option>
              </select>
            </div>

            <div className="form-group">
              <label>Featured Cover Image (Upload File)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setCoverImageFile(e.target.files[0]);
                  setCoverImageUrl("");
                }}
              />
              <small style={{ color: "#6b7280" }}>Recommended: 1200x630 landscape image for optimal WhatsApp & Facebook previews.</small>
              {coverImageFile && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={URL.createObjectURL(coverImageFile)}
                    alt="Cover preview"
                    className="cover-preview"
                    style={{ maxWidth: "250px", borderRadius: "8px" }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Or Image URL (Cloudinary / Web Link)</label>
              <input
                type="url"
                placeholder="https://res.cloudinary.com/..."
                value={coverImageUrl}
                onChange={(e) => {
                  setCoverImageUrl(e.target.value);
                  setCoverImageFile(null);
                }}
              />
            </div>

            <div className="form-group">
              <label>Article Content *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full press release or article here..."
                rows="10"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn" style={{ background: "#166534", color: "#fff", padding: "12px 24px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
              {loading ? "Publishing Story to Website..." : "Publish Article Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
