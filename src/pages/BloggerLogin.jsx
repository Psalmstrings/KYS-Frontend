import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import "../styles/blogStyles.css";

const API_URL = import.meta.env.BLOG_API_URL;

const BloggerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/blogger/login`, {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      toast.success("Login successful! Welcome to Blogger Dashboard");
      navigate("/blogger");
    } catch (err) {
      const message = err.response?.data?.message || "Login Failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Blogger Dashboard</h1>
        <p className="login-subtitle">Sign in to manage your blog posts</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          &copy; {new Date().getFullYear()} Office of the ZONE D PRO. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default BloggerLogin;