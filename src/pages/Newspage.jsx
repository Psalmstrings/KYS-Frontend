import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Navbarr from "../components/Navbarr";
import { FaSearch, FaCalendarAlt, FaTag, FaArrowRight } from "react-icons/fa";
import "../styles/homepage.css";
import "../styles/blogStyles.css";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";
  const defaultImage = "https://res.cloudinary.com/dd5p5t2rs/image/upload/v1773514865/blog_images/pd3q0fe4cnvj4pr5yr1i.jpg";

  const categories = ["All", "Official Release", "Student Welfare", "Events", "Partnership", "General"];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAllNews = async () => {
      try {
        const res = await axios.get(`${API_URL}/news/get/all?limit=50`);
        const data = res.data.news || res.data || [];
        setNews(data);
        setFilteredNews(data);
      } catch (err) {
        console.error("Error loading news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
  }, [API_URL]);

  useEffect(() => {
    let result = news;

    if (selectedCategory !== "All") {
      result = result.filter(
        (item) => (item.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(q) ||
          (item.content || "").toLowerCase().includes(q)
      );
    }

    setFilteredNews(result);
  }, [search, selectedCategory, news]);

  return (
    <div className="news-portal-page">
      <Helmet>
        <title>News & Press Center | Office of the PRO - NANS Southwest Zone D</title>
        <meta
          name="description"
          content="Official news updates, statements, press releases, and campus announcements from the Office of the Public Relations Officer, NANS Southwest Zone D."
        />
        <link rel="canonical" href="https://officeoftheprozoned.com/headlines" />
      </Helmet>

      <Navbarr />

      {/* Hero Header */}
      <section className="news-portal-hero">
        <div className="container">
          <span className="badge-tag">News & Press Center</span>
          <h1 className="news-hero-title">Official Announcements & Releases</h1>
          <p className="news-hero-subtitle">
            Verified updates from the Office of the PRO across Southwest tertiary institutions.
          </p>

          {/* Search Box */}
          <div className="news-search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search news, topics, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-search-btn" onClick={() => setSearch("")}>
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="news-list-section container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading news stories...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="no-results-box">
            <h3>No articles found</h3>
            <p>We couldn't find any articles matching "{search}". Try searching for other keywords or select 'All'.</p>
            <button className="primary-btn" onClick={() => { setSearch(""); setSelectedCategory("All"); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="news-grid-layout">
            {filteredNews.map((article) => (
              <article key={article._id} className="news-archive-card">
                <Link to={`/news/${article._id}`} className="card-thumb-link">
                  <div className="news-thumb-wrap">
                    <img
                      src={article.coverImage || defaultImage}
                      alt={article.title}
                      loading="lazy"
                    />
                    <span className="category-tag">
                      <FaTag /> {article.category || "Official Release"}
                    </span>
                  </div>
                </Link>

                <div className="card-details">
                  <div className="card-meta">
                    <span className="meta-date">
                      <FaCalendarAlt />{" "}
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="card-title">
                    <Link to={`/news/${article._id}`}>{article.title}</Link>
                  </h3>

                  <p className="card-excerpt">
                    {article.content ? article.content.replace(/<[^>]*>?/gm, "").slice(0, 130) + "..." : ""}
                  </p>

                  <Link to={`/news/${article._id}`} className="card-read-more">
                    Read Full Story <FaArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} NANS SOUTHWEST — Office of the Public Relations Officer.</p>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about-us">About & Leadership</Link>
            <Link to="/register">KYS Portal</Link>
            <Link to="/verify-status">Verify Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsPage;
