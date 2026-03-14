import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import "../styles/createNews.css"; 
import Sidebar from "./BloggerSideBar";
import Navbar from "./BloggerNavbar";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API; 

export default function CreateeNews() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null); // File object
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Use FormData to send files
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (coverImageFile) formData.append("coverImage", coverImageFile);

      const { data } = await axios.post(`${API_URL}/news/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("News created successfully!");
      // Clear form
      setTitle("");
      setContent("");
      setCategory("");
      setCoverImageFile(null);

      navigate("/blog/profile"); // Redirect to news management page
      console.log("Created news:", data);
    } catch (err) {
      console.error("Error creating news:", err);
      toast.error("Failed to create news");
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
          <h2>Create News</h2>
          <form className="create-news-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title*</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter news title"
                required
              />
            </div>

            <div className="form-group">
              <label>Content*</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter news content"
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Category*</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
                required
              />
            </div>

            <div className="form-group">
              <label>Cover Image</label>
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

            <button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Create News"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}