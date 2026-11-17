import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import "../styles/createNews.css"; 
import Sidebar from "./BloggerSideBar";
import Navbar from "./BloggerNavbar";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api"; 

export default function BloggerCreateNews() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [category, setCategory] = useState("Press Release");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !category) {
      toast.error("Please fill in all required fields (Title, Category, Content)");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      formData.append("category", category);
      if (coverImageFile) formData.append("coverImage", coverImageFile);

      const token = localStorage.getItem("blogger_token") || localStorage.getItem("token");

      await axios.post(`${API_URL}/news/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("News submitted successfully for review!");
      setTitle("");
      setContent("");
      setCoverImageFile(null);

      navigate("/blog/profile");
    } catch (err) {
      console.error("Error creating news:", err);
      const msg = err.response?.data?.message || err.message || "Failed to submit news";
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
          <h2>Submit News Story</h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>
            Stories submitted by media contributors will be reviewed and published to the official website.
          </p>

          <form className="create-news-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Article Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter headline"
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Press Release">Press Release</option>
                <option value="Student Welfare">Student Welfare</option>
                <option value="Events & Summits">Events & Summits</option>
                <option value="Campus Reports">Campus Reports</option>
                <option value="Educational Partnership">Educational Partnership</option>
                <option value="General News">General News</option>
              </select>
            </div>

            <div className="form-group">
              <label>Featured Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImageFile(e.target.files[0])}
              />
              {coverImageFile && (
                <img
                  src={URL.createObjectURL(coverImageFile)}
                  alt="Cover preview"
                  className="cover-preview"
                />
              )}
            </div>

            <div className="form-group">
              <label>Article Content *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type or paste the complete news article text..."
                rows="8"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Submitting for Review..." : "Submit Article for Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
