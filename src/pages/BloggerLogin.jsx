import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import "../styles/blogStyles.css";

const API_URL = import.meta.env.VITE_API; 

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
      const { data } = await axios.post(
        `${API_URL}/auth/blogger/login`,
        {
          email,
          password,
        }
      );

      // Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.blogger.role)

      // Save role safely
      if (data.blogger?.role) {
        localStorage.setItem("role", data.blogger.role);
      }

      toast.success("Login successful! Welcome to Blogger Dashboard");

      navigate("/blog/profile");

    } catch (err) {
      console.log(err);

      const message = err.response?.data?.message || "Login failed";
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
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="login-footer">
          © {new Date().getFullYear()} Office of the ZONE D PRO. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default BloggerLogin;