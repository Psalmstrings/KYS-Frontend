import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt, FaArrowRight, FaTag } from "react-icons/fa";
import "../styles/homepage.css";

export default function NewsHeadlines() {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_URL}/news/headlines`);
        if (Array.isArray(res.data)) {
          const sorted = res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setHeadlines(sorted);
        } else {
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

  if (loading) {
    return (
      <section className="news-headlines-section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="badge-tag">Press & Media</span>
            <h2 className="section-title">Latest Updates & Press Releases</h2>
            <p className="section-subtext">Loading latest announcements...</p>
          </div>
        </div>
      </section>
    );
  }

  const defaultImage = "https://res.cloudinary.com/dd5p5t2rs/image/upload/v1773514865/blog_images/pd3q0fe4cnvj4pr5yr1i.jpg";
  // Display maximum of 4 latest news
  const latestFour = headlines.slice(0, 4);

  return (
    <section className="news-headlines-section">
      <div className="container">
        <div className="section-header-row">
          <div>
            <span className="badge-tag">Press & Media</span>
            <h2 className="section-title">Latest Updates & Press Releases</h2>
            <p className="section-subtext">Official statements, news, and releases from the Office of the PRO</p>
          </div>
          <Link to="/headlines" className="view-all-link">
            All News <FaArrowRight />
          </Link>
        </div>

        {latestFour.length === 0 ? (
          <div className="no-news-box">
            <p className="no-news">No updates published at this time.</p>
          </div>
        ) : (
          <>
            <div className="news-cards-grid">
              {latestFour.map((item) => (
                <Link key={item._id} className="news-card-item" to={`/news/${item._id}`}>
                  <div className="news-card-image-wrapper">
                    <img
                      src={item.coverImage || defaultImage}
                      alt={item.title}
                      loading="lazy"
                      className="news-card-img"
                    />
                    <span className="news-card-badge">
                      <FaTag /> {item.category || "Official Release"}
                    </span>
                  </div>
                  <div className="news-card-body">
                    <span className="news-card-date">
                      <FaCalendarAlt /> {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="news-card-title">{item.title}</h3>
                    <span className="read-more-text">
                      Read Story <FaArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* See More Button Directing to News Page */}
            <div className="see-more-container">
              <Link to="/headlines" className="see-more-btn">
                See More News & Press Releases <FaArrowRight />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
