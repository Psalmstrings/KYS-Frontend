import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import Navbarr from "../components/Navbarr";
import { 
  FaWhatsapp, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaLink, 
  FaCalendarAlt, 
  FaUserEdit, 
  FaTag, 
  FaArrowLeft,
  FaEye
} from "react-icons/fa";
import "../styles/blogStyles.css";

export default function SingleNews() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_URL}/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load article. It may have been moved or unpublished.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [API_URL, id]);

  const canonicalUrl = `https://officeoftheprozoned.com/news/${news?._id || id}`;
  const pageUrl = canonicalUrl;
  const plainTextContent = news?.content ? news.content.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim() : "";
  const shortDescription = plainTextContent ? (plainTextContent.length > 180 ? plainTextContent.slice(0, 177) + "..." : plainTextContent) : "Read the latest update from NANS Southwest Zone D Office of the PRO.";
  
  let rawImage = news?.coverImage || "https://res.cloudinary.com/dd5p5t2rs/image/upload/v1773514865/blog_images/pd3q0fe4cnvj4pr5yr1i.jpg";
  rawImage = rawImage.trim().replace(/^http:\/\//, "https://");
  let featuredImage = rawImage;
  if (rawImage.includes("res.cloudinary.com") && rawImage.includes("/upload/")) {
    if (!rawImage.includes("c_fill")) {
      featuredImage = rawImage.replace("/upload/", "/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/");
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    toast.success("Article link copied! Ready to share with image preview.");
    setTimeout(() => setCopied(false), 3000);
  };

  const shareWhatsApp = () => {
    const text = `*${news?.title}*\n\n${shortDescription}\n\nRead full story:\n${canonicalUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`, "_blank");
  };

  const shareTwitter = () => {
    const text = `${news?.title} — Office of the PRO NANS Southwest Zone D`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(canonicalUrl)}`, "_blank");
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`, "_blank");
  };

  return (
    <div className="single-news-wrapper">
      <Navbarr />

      {news && (
        <Helmet>
          <title>{news.title} | Office of the PRO - NANS Southwest</title>
          <meta name="description" content={shortDescription} />
          <link rel="canonical" href={pageUrl} />

          {/* Open Graph Meta Tags (Facebook / WhatsApp / LinkedIn) */}
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="NANS Southwest Zone D — Office of the PRO" />
          <meta property="og:title" content={news.title} />
          <meta property="og:description" content={shortDescription} />
          <meta property="og:image" content={featuredImage} />
          <meta property="og:image:secure_url" content={featuredImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content={pageUrl} />

          {/* Twitter / X Cards */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={news.title} />
          <meta name="twitter:description" content={shortDescription} />
          <meta name="twitter:image" content={featuredImage} />

          {/* Schema.org Article Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "headline": news.title,
              "image": [featuredImage],
              "datePublished": news.createdAt,
              "dateModified": news.updatedAt || news.createdAt,
              "author": {
                "@type": "Person",
                "name": news.author?.name || "Office of the PRO"
              },
              "publisher": {
                "@type": "Organization",
                "name": "NANS Southwest Zone D",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://res.cloudinary.com/dd5p5t2rs/image/upload/v1773514865/blog_images/pd3q0fe4cnvj4pr5yr1i.jpg"
                }
              },
              "description": shortDescription
            })}
          </script>
        </Helmet>
      )}

      <main className="single-news-main">
        <div className="container news-container">
          <Link to="/headlines" className="back-link">
            <FaArrowLeft /> Back to All News
          </Link>

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading article...</p>
            </div>
          )}

          {error && (
            <div className="error-card">
              <h3>Notice</h3>
              <p>{error}</p>
              <Link to="/headlines" className="primary-btn">Browse Headlines</Link>
            </div>
          )}

          {news && (
            <article className="article-content">
              {/* Category & Meta Header */}
              <div className="article-header">
                <span className="article-category">
                  <FaTag /> {news.category || "Official Release"}
                </span>
                <div className="article-meta-row">
                  <span className="article-date">
                    <FaCalendarAlt /> {new Date(news.createdAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="article-author">
                    <FaUserEdit /> By {news.author?.name || "Office of the PRO"}
                  </span>
                  {news.views > 0 && (
                    <span className="article-views">
                      <FaEye /> {news.views} views
                    </span>
                  )}
                </div>

                <h1 className="article-title">{news.title}</h1>
              </div>

              {/* Featured Cover Image */}
              {featuredImage && (
                <div className="article-featured-image-wrapper">
                  <img
                    className="article-featured-image"
                    src={featuredImage}
                    alt={news.title}
                    loading="eager"
                  />
                </div>
              )}

              {/* Social Sharing Bar */}
              <div className="share-section">
                <span className="share-label">Share this article:</span>
                <div className="share-buttons">
                  <button 
                    onClick={shareWhatsApp} 
                    className="share-btn whatsapp" 
                    title="Share on WhatsApp"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>
                  <button 
                    onClick={shareFacebook} 
                    className="share-btn facebook" 
                    title="Share on Facebook"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebookF /> Facebook
                  </button>
                  <button 
                    onClick={shareTwitter} 
                    className="share-btn twitter" 
                    title="Share on X"
                    aria-label="Share on X"
                  >
                    <FaTwitter /> X
                  </button>
                  <button 
                    onClick={shareLinkedIn} 
                    className="share-btn linkedin" 
                    title="Share on LinkedIn"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedinIn /> LinkedIn
                  </button>
                  <button 
                    onClick={handleCopyLink} 
                    className="share-btn copy" 
                    title="Copy Article Link"
                    aria-label="Copy Article Link"
                  >
                    <FaLink /> {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              {/* Article Body */}
              <div className="article-body">
                {news.content.split("\n\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Bottom Sharing Bar */}
              <div className="article-footer-box">
                <h4>Support Student Communication</h4>
                <p>Help keep fellow students informed across all SouthWest campuses by sharing this update.</p>
                <div className="share-buttons">
                  <button onClick={shareWhatsApp} className="share-btn whatsapp"><FaWhatsapp /> WhatsApp</button>
                  <button onClick={shareFacebook} className="share-btn facebook"><FaFacebookF /> Facebook</button>
                  <button onClick={shareTwitter} className="share-btn twitter"><FaTwitter /> X</button>
                  <button onClick={handleCopyLink} className="share-btn copy"><FaLink /> {copied ? "Copied!" : "Copy Link"}</button>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} NANS SOUTHWEST — Office of the Public Relations Officer.</p>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about-us">About & Leadership</Link>
            <Link to="/register">KYS Portal</Link>
            <Link to="/headlines">News</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
