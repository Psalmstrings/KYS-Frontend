import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/blogStyles.css";

export default function NewsHeadlines() {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.BLOG_API_URL; // Example: http://localhost:5000/api

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/news/headlines`);
        if (Array.isArray(res.data)) {
          setHeadlines(res.data);
          console.log("Fetched headlines:", res.data); // Debug log
        } else {
          console.warn("Unexpected response format:", res.data);
          setHeadlines([]);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setHeadlines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [API_URL]);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Loading news...
      </p>
    );

  return (
    <>
      <div className="newss-headlines">
        <header className="top-header">
        <div className="container">
          <h1 className="site-title">Latest News</h1>
        </div>
      </header>

      <div className="head-cont">

        {headlines.length === 0 ? (
          <p>No news available.</p>
        ) : (
          <div className="headline-list">
            {headlines.map((item) => (
              <Link
                key={item._id}
                className="headline-card"
                to={`/news/${item._id}`}
              >
                <h3>{item.title}</h3>
                <span className="date">
                  {new Date(item.createdAt).toDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>
       
    </>
  );
}