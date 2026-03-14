import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "../styles/adminDashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

export default function BlogAdminDashboard() {
  const [bloggers, setBloggers] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with random data
    const fetchMockData = () => {
      const mockBloggers = [
        { _id: "1", name: "John Doe", email: "john@example.com", suspended: false },
        { _id: "2", name: "Jane Smith", email: "jane@example.com", suspended: true },
        { _id: "3", name: "Alice Johnson", email: "alice@example.com", suspended: false },
        { _id: "4", name: "Bob Brown", email: "bob@example.com", suspended: false },
      ];

      const mockNews = [
        { _id: "101", title: "Breaking News 1", author: { name: "John Doe" }, approved: true },
        { _id: "102", title: "Tech Update", author: { name: "Jane Smith" }, approved: false },
        { _id: "103", title: "Sports Highlights", author: { name: "Alice Johnson" }, approved: true },
        { _id: "104", title: "Politics Today", author: { name: "Bob Brown" }, approved: false },
        { _id: "105", title: "Entertainment Buzz", author: { name: "John Doe" }, approved: true },
      ];

      setBloggers(mockBloggers);
      setNews(mockNews);
      setLoading(false);
    };

    setTimeout(fetchMockData, 1000); // simulate loading delay
  }, []);

  // Analytics
  const totalBloggers = bloggers.length;
  const suspendedBloggers = bloggers.filter((b) => b.suspended).length;

  const totalNews = news.length;
  const approvedNews = news.filter((n) => n.approved).length;
  const pendingNews = totalNews - approvedNews;

  const pieDataBloggers = [
    { name: "Active", value: totalBloggers - suspendedBloggers },
    { name: "Suspended", value: suspendedBloggers },
  ];

  const pieDataNews = [
    { name: "Approved", value: approvedNews },
    { name: "Pending", value: pendingNews },
  ];

  return (
    
    <div>
      <Navbar />
      <div className="section">
      <Sidebar />
      <div className="admin-dashboard">
     
      <h1>Admin Dashboard</h1>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "40px" }}>Loading dashboard...</p>
      ) : (
        <>
          <div className="stats-cards">
            <div className="card">
              <h3>Total Bloggers</h3>
              <p>{totalBloggers}</p>
            </div>
            <div className="card">
              <h3>Suspended Bloggers</h3>
              <p>{suspendedBloggers}</p>
            </div>
            <div className="card">
              <h3>Total News</h3>
              <p>{totalNews}</p>
            </div>
            <div className="card">
              <h3>Pending News</h3>
              <p>{pendingNews}</p>
            </div>
          </div>

          <div className="charts">
            <div className="chart-container">
              <h3>Bloggers Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieDataBloggers}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieDataBloggers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>News Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieDataNews}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieDataNews.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="tables-section">
            <h2>Bloggers List</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bloggers.map((b) => (
                  <tr key={b._id}>
                    <td>{b.name}</td>
                    <td>{b.email}</td>
                    <td>{b.suspended ? "Suspended" : "Active"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2>News List</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n._id}>
                    <td>{n.title}</td>
                    <td>{n.author?.name}</td>
                    <td>{n.approved ? "Approved" : "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
    </div>
    </div>
  );
}