import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/blogStyles.css";


export default function NewsHeadlines() {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API; 

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_URL}/news/headlines`);
        if (Array.isArray(res.data)) {
          // Sort latest first (descending by createdAt)
          const sorted = res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setHeadlines(sorted);
          console.log("Fetched headlines:", sorted);
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