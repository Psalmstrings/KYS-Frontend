import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";   // SEO metadata
import "../styles/blogStyles.css";

export default function SingleNews() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API; 

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_URL}/news/${id}`, { withCredentials: true });
        setNews(res.data);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [API_URL, id]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading news...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>{error}</p>;
  if (!news) return <p style={{ textAlign: "center", marginTop: "40px" }}>News not found.</p>;

  const pageUrl = `${window.location.origin}/news/${id}`;
  const shortDescription = news.content?.slice(0, 150) + "...";

  return (
    <>
      {/* ---------- SEO METADATA ---------- */}
      <Helmet>
        <title>{news.title} | Latest News</title>

        <meta name="description" content={shortDescription} />

        {/* --- Open Graph (Facebook, WhatsApp) --- */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={shortDescription} />
        <meta property="og:image" content={news.coverImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="News Portal" />

        {/* --- Twitter Card --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={news.title} />
        <meta name="twitter:description" content={shortDescription} />
        <meta name="twitter:image" content={news.coverImage} />
      </Helmet>

      {/* ---------- PAGE CONTENT ---------- */}
      <header className="top-header">
        <div className="container">
          <h1 className="site-title">News Details</h1>
        </div>
      </header>

      <section className="news-details container">
        <h1 className="news-title">{news.title}</h1>
        <span className="date">{new Date(news.createdAt).toDateString()}</span>

        {news.coverImage && (
          <img className="news-cover" src={news.coverImage} alt={news.title} />
        )}

        <p className="news-content">{news.content}</p>
      </section>
    </>
  );
}