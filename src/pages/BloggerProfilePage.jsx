import React, { useEffect, useState } from "react";
import "../styles/bloggerProfile.css";
import Sidebar from "../components/BloggerSideBar";
import Navbar from "../components/BloggerNavbar";

export default function BloggerProfile() {
  const [blogger, setBlogger] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data (replace with API calls later)
  const fetchBloggerData = () => {
    setLoading(true);
    // Mock blogger info
    const mockBlogger = {
      name: "Alice Johnson",
      email: "alice@example.com",
      profileImage: "https://i.pravatar.cc/150?img=5",
      bio: "Passionate about tech and education. Sharing insights and updates with the community.",
    };

    // Mock news
    const mockNews = [
      { _id: "n1", title: "Breaking: New Policy Announced", approved: true },
      { _id: "n2", title: "Tech Trends 2026", approved: false },
      { _id: "n3", title: "Community Event Highlights", approved: true },
      { _id: "n4", title: "Education Reforms Explained", approved: false },
    ];

    setBlogger(mockBlogger);
    setNews(mockNews);
    setLoading(false);
  };

  useEffect(() => {
    fetchBloggerData();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading profile...</p>;
  if (!blogger) return <p>Blogger not found.</p>;

  const totalNews = news.length;
  const approvedNews = news.filter(n => n.approved).length;
  const pendingNews = totalNews - approvedNews;

  return (
   <div>
    <Navbar />
     <div className="section">
        <Sidebar />
        <div className="blogger-profile container">
      <div className="profile-header">
        <img src={blogger.profileImage} alt={blogger.name} className="profile-image" />
        <div className="profile-info">
          <h1>{blogger.name}</h1>
          <p className="email">{blogger.email}</p>
          <p className="bio">{blogger.bio}</p>
          <div className="profile-stats">
            <span>Total News: {totalNews}</span>
            <span>Approved: {approvedNews}</span>
            <span>Pending: {pendingNews}</span>
          </div>
        </div>
      </div>

      <section className="blogger-news">
        <h2>My News</h2>
        {news.length === 0 ? (
          <p>No news posted yet.</p>
        ) : (
          <ul className="news-list">
            {news.map(n => (
              <li key={n._id} className={n.approved ? "approved" : "pending"}>
                <span className="news-title">{n.title}</span>
                <span className="news-status">{n.approved ? "Approved" : "Pending"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
    </div>
   </div>
  );
}