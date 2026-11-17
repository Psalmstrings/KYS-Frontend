import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import Navbarr from "../components/Navbarr";
import NewsHeadlines from "../components/NewsHeadline";
import { 
  FaArrowRight, 
  FaBullhorn, 
  FaShieldAlt, 
  FaUsers, 
  FaPaperPlane, 
  FaCheckCircle, 
  FaTimes,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";

import "../styles/homepage.css";

// Static assets as guaranteed fallbacks
import nansLogo from "../assets/download__4_-removebg-preview.png";
import ideological from "../assets/WhatsApp Image 2026-02-05 at 2.35.01 PM.jpeg";
import proImage from "../assets/IMG_2842.JPG";

// State PRO Portraits
import osunPro from "../assets/COMR IBRAHEEM.jpeg";
import lagosPro from "../assets/Comrade Ridwan.jpeg";
import ondoPro from "../assets/JOHNPAU.jpeg";
import oyoPro from "../assets/COMRADE. ADEYANJU.jpeg";
import ogunPro from "../assets/Celebrity Farmer.jpeg";
import ekitiPro from "../assets/AD Smart.jpeg";

// Default State PRO profiles ensuring immediate rendering
const defaultStatePros = [
  {
    _id: "pro-lagos",
    fullName: "Comrade Ridwan Ajayi",
    position: "PRO, NANS JCC LAGOS",
    state: "Lagos State",
    category: "State PRO",
    photo: lagosPro,
    biography: "Grassroots student communicator driving campus engagement and public relations across Lagos State campuses.",
    portfolio: "Student public relations, institutional stakeholder liaison, and media advocacy for the Lagos student constituency.",
    responsibilities: [
      "Facilitating constructive dialogue between Lagos campus leaders and student bodies.",
      "Monitoring and reporting on student welfare challenges across Lagos campuses.",
      "Managing official press releases for NANS JCC Lagos."
    ]
  },
  {
    _id: "pro-ogun",
    fullName: "Comr Sodiq Hassan (Celebrity Farmer)",
    position: "PRO, NANS JCC OGUN",
    state: "Ogun State",
    category: "State PRO",
    photo: ogunPro,
    biography: "Youth advocate and public relations officer dedicated to student empowerment and engagement across Ogun State.",
    portfolio: "Public communication, campus advocacy, and student integration across higher institutions in the Gateway State.",
    responsibilities: [
      "Facilitating information flow across all Ogun State tertiary institutions.",
      "Leading student welfare interventions and campus security advocacy.",
      "Promoting innovation, entrepreneurship, and agricultural initiatives among students."
    ]
  },
  {
    _id: "pro-oyo",
    fullName: "Comrade Adeyanju Joshua (Aniyikaye)",
    position: "PRO, NANS JCC OYO",
    state: "Oyo State",
    category: "State PRO",
    photo: oyoPro,
    biography: "Dynamic student advocate coordinating public relations and youth development initiatives across Oyo State.",
    portfolio: "Strategic communication, student advocacy, and institutional relations across all tertiary institutions in Oyo State.",
    responsibilities: [
      "Strengthening communication networks across Oyo State higher institutions.",
      "Representing student interests at state Joint Campus Committee forums.",
      "Spearheading youth empowerment and conflict management initiatives."
    ]
  },
  {
    _id: "pro-osun",
    fullName: "Comrade Ibraheem Ayomide Alabi (IB POL)",
    position: "PRO, NANS JCC OSUN",
    state: "Osun State",
    category: "State PRO",
    photo: osunPro,
    biography: "Dedicated student advocate and media strategist coordinating information flow across tertiary institutions in Osun State.",
    portfolio: "State-wide student media coordination, JCC campus press relations, and swift grievance resolution for Osun students.",
    responsibilities: [
      "Coordinating information dissemination across Osun tertiary institutions.",
      "Advocating for student welfare issues with state and campus management.",
      "Promoting NANS Zone D initiatives including Know Your Student (KYS)."
    ]
  },
  {
    _id: "pro-ondo",
    fullName: "Johnpaul Olamakinde Alabi (Makins)",
    position: "PRO, NANS JCC ONDO",
    state: "Ondo State",
    category: "State PRO",
    photo: ondoPro,
    biography: "Vibrant student leader and media liaison amplifying the voice of Ondo State students.",
    portfolio: "Media liaison, campus engagement, and student representation across federal, state, and private tertiary institutions in Ondo State.",
    responsibilities: [
      "Championing campus press freedom and student welfare advocacy in Ondo State.",
      "Serving as the official communication bridge for NANS JCC Ondo.",
      "Assisting students with bursary and welfare inquiries."
    ]
  },
  {
    _id: "pro-ekiti",
    fullName: "Comrade Adesipe Smart Ayodeji F. (AD Smart)",
    position: "PRO, NANS JCC EKITI",
    state: "Ekiti State",
    category: "State PRO",
    photo: ekitiPro,
    biography: "Media coordinator and youth leader serving the student community across Ekiti State institutions.",
    portfolio: "Media coordination, campus engagement, and student representation across the Land of Honour.",
    responsibilities: [
      "Ensuring prompt, accurate communication across Ekiti tertiary institutions.",
      "Promoting academic excellence and student rights.",
      "Mobilizing campus participation for NANS Zone D programmes."
    ]
  }
];

const fallbackPhotoMap = {
  "Comrade Tope Olugbemi (Celebrity Surveyor)": proImage,
  "Comrade Ibraheem Ayomide Alabi (IB POL)": osunPro,
  "Comrade Ridwan Ajayi": lagosPro,
  "Johnpaul Olamakinde Alabi (Makins)": ondoPro,
  "Comrade Adeyanju Joshua (Aniyikaye)": oyoPro,
  "Comr Sodiq Hassan (Celebrity Farmer)": ogunPro,
  "Comrade Adesipe Smart Ayodeji F. (AD Smart)": ekitiPro,
};

const Homepage = () => {
  const [homepageData, setHomepageData] = useState(null);
  const [statePros, setStatePros] = useState(defaultStatePros);
  const [selectedLeaderModal, setSelectedLeaderModal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    school: "",
    level: "",
    message: "",
    category: "Inquiry"
  });
  const [submittingContact, setSubmittingContact] = useState(false);

  // Gallery lightbox modal state
  const [activeMedia, setActiveMedia] = useState(null);

  const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const [hpRes, leadRes] = await Promise.all([
          axios.get(`${API_URL}/homepage`).catch(() => null),
          axios.get(`${API_URL}/leadership`).catch(() => null)
        ]);

        if (hpRes?.data?.homepage) {
          setHomepageData(hpRes.data.homepage);
        }

        if (leadRes?.data?.profiles && Array.isArray(leadRes.data.profiles)) {
          const fetchedStatePros = leadRes.data.profiles.filter(
            p => p.category === "State PRO" || (p.position && p.position.includes("JCC"))
          );

          if (fetchedStatePros.length > 0) {
            const merged = fetchedStatePros.map(p => {
              const matchedPhoto = p.photo || fallbackPhotoMap[p.fullName];
              const defaultObj = defaultStatePros.find(
                d => d.fullName.toLowerCase().includes(p.fullName.toLowerCase()) || 
                     (p.state && d.state.toLowerCase().includes(p.state.toLowerCase()))
              );
              return {
                ...p,
                photo: matchedPhoto || defaultObj?.photo || nansLogo,
                biography: p.biography || defaultObj?.biography || "",
                portfolio: p.portfolio || defaultObj?.portfolio || "",
                responsibilities: (p.responsibilities && p.responsibilities.length > 0) ? p.responsibilities : defaultObj?.responsibilities || []
              };
            });
            setStatePros(merged);
          }
        }
      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepage();
  }, [API_URL]);

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.school || !contactForm.message) {
      toast.error("Please fill in all required fields (Name, Institution, Message)");
      return;
    }

    setSubmittingContact(true);

    try {
      await axios.post(`${API_URL}/inquiries/submit`, contactForm);
      toast.success("Thank you! Your complaint/inquiry has been received by the Office of the PRO.");
      setContactForm({
        fullName: "",
        email: "",
        phone: "",
        school: "",
        level: "",
        message: "",
        category: "Inquiry"
      });
    } catch (err) {
      console.error("Contact submit error:", err);
      toast.error(err.response?.data?.message || "Failed to submit message. Please try again.");
    } finally {
      setSubmittingContact(false);
    }
  };

  const hero = homepageData?.hero || {};
  const aboutOffice = homepageData?.aboutOffice || {};
  const meetPro = homepageData?.meetPro || {};
  const kysBanner = homepageData?.kysBanner || {};
  const stats = homepageData?.statistics || [
    { label: "Tertiary Institutions", value: "70+" },
    { label: "Southwest States", value: "6" },
    { label: "Active Student Reach", value: "1M+" },
    { label: "Student Advocacy", value: "24/7" },
  ];

  return (
    <div className="homepage-wrapper">
      <Helmet>
        <title>NANS Southwest Zone D — Office of the Public Relations Officer</title>
        <meta
          name="description"
          content={hero.description || "Official portal of the Office of the PRO, NANS Southwest Zone D. Promoting transparency, campus engagement, and student representation across Lagos, Ogun, Oyo, Osun, Ondo, and Ekiti."}
        />
        <link rel="canonical" href="https://officeoftheprozoned.com/" />
      </Helmet>

      {/* NAVBAR */}
      <Navbarr />

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section fade-in">
        <div className="hero-grid container">
          <div className="hero-text slide-up">
            <div className="hero-badge">
              <img src={nansLogo} alt="NANS Logo" className="hero-mini-logo" />
              <span>National Association of Nigerian Students</span>
            </div>

            <h1 className="hero-title">{hero.title || "NANS SouthWest — ZONE D"}</h1>
            <h2 className="hero-subtitle">{hero.subtitle || "Office of the Public Relations Officer"}</h2>
            <p className="hero-description">
              {hero.description || "Promoting Transparency, Engagement & Effective Communication Across SouthWest Campuses."}
            </p>

            <div className="hero-action-buttons">
              <Link to={hero.ctaLink || "/register"} className="hero-primary-btn">
                {hero.ctaText || "KYS Registration Now Open →"}
              </Link>
              <Link to="/about-us" className="hero-secondary-btn">
                Meet the Leadership
              </Link>
            </div>
          </div>

          <div className="hero-visual-container">
            <div className="hero-card-display">
              <div className="hero-card-inner">
                <img src={proImage} alt="PRO" className="hero-display-img" />
                <div className="hero-card-caption">
                  <h4>Comrade Tope Olugbemi</h4>
                  <p>PRO, NANS Zone D (Celebrity Surveyor)</p>
                </div>
              </div>
            </div>
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
          </div>
        </div>
      </section>

      {/* ================= STATS COUNTER STRIP ================= */}
      <section className="stats-strip-section">
        <div className="container stats-grid">
          {stats.map((s, idx) => (
            <div key={idx} className="stat-card">
              <h3 className="stat-value">{s.value}</h3>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT PRO OFFICE ================= */}
      <section className="about-office-section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="badge-tag">Our Mandate</span>
            <h2 className="section-title">{aboutOffice.title || "About The PRO Office"}</h2>
            <p className="section-subtext">
              {aboutOffice.description ||
                "The Office of the Public Relations Officer serves as the communication backbone of NANS SouthWest — ensuring accurate information flow, conflict resolution, and improved student-government relations."}
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon">
                <FaBullhorn />
              </div>
              <h3>Communication</h3>
              <p>Timely and clear communication between the leadership and all SouthWest campuses.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon">
                <FaShieldAlt />
              </div>
              <h3>Transparency</h3>
              <p>Ensuring students have access to verified, unbiased, and transparent institutional information.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon">
                <FaUsers />
              </div>
              <h3>Representation</h3>
              <p>Amplifying the voices, concerns, and welfare priorities of students at zonal and national levels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEWS HEADLINES (MAX 4 + SEE MORE) ================= */}
      <NewsHeadlines />

      {/* ================= MEET THE PRO (EXECUTIVE SHOWCASE) ================= */}
      <section className="meet-pro-section">
        <div className="container">
          <div className="meet-pro-grid">
            <div className="meet-pro-photo-wrap">
              <img
                src={meetPro.image || proImage}
                alt={meetPro.name || "Comrade Tope Olugbemi"}
                className="pro-featured-img"
              />
              <div className="pro-title-pill">
                <h4>{meetPro.name || "TOPE OLUGBEMI"}</h4>
                <span>{meetPro.title || "PRO, NANS ZONE-D (Celebrity Surveyor)"}</span>
              </div>
            </div>

            <div className="meet-pro-details">
              <span className="badge-tag">Office Leadership</span>
              <h2 className="pro-headline">Meet the Public Relations Officer</h2>
              <blockquote className="pro-tagline">
                "{meetPro.tagline || "A Voice. A Vision. A Responsibility."}"
              </blockquote>

              <p className="pro-bio-text">
                {meetPro.bio ||
                  "Comrade Tope Olugbemi is a young leader known for responsibility, integrity, and a clear sense of purpose. Popularly called the 'Celebrity Surveyor', he brings precision, structure, and forward thinking into both his profession and his leadership. Tope believes leadership is more than a title. To him, it is a responsibility to serve others and create real value. His approach focuses on accountability, thoughtful decisions, and staying committed to doing what is right even under pressure."}
              </p>

              <div className="pro-action-row">
                <Link to="/about-us#leadership" className="pro-more-btn">
                  View Full Leadership Directory <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATE JCC PROS SHOWCASE ================= */}
      <section className="state-pros-section" id="state-pros">
        <div className="container">
          <div className="section-title-wrap">
            <span className="badge-tag">Zonal Media Network</span>
            <h2 className="section-title">State Joint Campus Committee (JCC) PROs</h2>
            <p className="section-subtext">
              Meet the official Public Relations Officers coordinating information flow, campus engagement, and student welfare across all 6 Southwest states.
            </p>
          </div>

          <div className="state-pros-grid">
            {statePros.map((pro) => (
              <div 
                key={pro._id} 
                className="state-pro-card" 
                onClick={() => setSelectedLeaderModal(pro)}
              >
                <div className="state-pro-badge-top">
                  <FaMapMarkerAlt /> {pro.state}
                </div>
                <div className="state-pro-photo-wrap">
                  <img src={pro.photo} alt={pro.fullName} loading="lazy" />
                </div>
                <div className="state-pro-content">
                  <h4 className="state-pro-name">{pro.fullName}</h4>
                  <span className="state-pro-position">{pro.position}</span>
                  <p className="state-pro-bio-snippet">{pro.biography || pro.portfolio}</p>
                  <button
                    className="state-pro-detail-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLeaderModal(pro);
                    }}
                  >
                    View Profile & Portfolio →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State PRO Interactive Modal */}
      {selectedLeaderModal && (
        <div className="state-pro-modal-backdrop" onClick={() => setSelectedLeaderModal(null)}>
          <div className="state-pro-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-icon" onClick={() => setSelectedLeaderModal(null)}>
              <FaTimes />
            </button>
            <div className="modal-header-flex">
              <img src={selectedLeaderModal.photo} alt={selectedLeaderModal.fullName} className="modal-photo" />
              <div className="modal-header-text">
                <h3>{selectedLeaderModal.fullName}</h3>
                <div className="modal-pos">{selectedLeaderModal.position}</div>
                <div className="modal-state"><FaMapMarkerAlt /> {selectedLeaderModal.state}</div>
              </div>
            </div>

            {selectedLeaderModal.biography && (
              <>
                <h4 className="modal-section-title">Officer Biography</h4>
                <p className="modal-bio-text">{selectedLeaderModal.biography}</p>
              </>
            )}

            {selectedLeaderModal.portfolio && (
              <>
                <h4 className="modal-section-title">Portfolio & Core Duties</h4>
                <p className="modal-bio-text">{selectedLeaderModal.portfolio}</p>
              </>
            )}

            {selectedLeaderModal.responsibilities && selectedLeaderModal.responsibilities.length > 0 && (
              <>
                <h4 className="modal-section-title">Key Responsibilities</h4>
                <ul className="modal-resp-list">
                  {selectedLeaderModal.responsibilities.map((r, i) => (
                    <li key={i}>
                      <FaCheckCircle className="modal-check-icon" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= KYS INITIATIVE SHOWCASE ================= */}
      <section className="kys-initiative-section">
        <div className="container">
          <div className="kys-initiative-card">
            <div className="kys-content">
              <span className="badge-tag light">Flagship Student Initiative</span>
              <h2>{kysBanner.title || "Know Your Student (KYS) Platform"}</h2>
              <p>
                {kysBanner.description ||
                  "The Southwest PRO of the National Association of Nigerian Students (NANS) has kicked off an exciting new program called “Know Your Students” (KYS). The goal? To bring student leadership closer to the students themselves. KYS ensures that the voices, academic concerns, and welfare requirements of Nigerian students guide policymaking and advocacy."}
              </p>

              <div className="kys-features-list">
                <div className="kys-feature-item">
                  <FaCheckCircle className="feat-icon" />
                  <span>Verified digital student identification record</span>
                </div>
                <div className="kys-feature-item">
                  <FaCheckCircle className="feat-icon" />
                  <span>Direct conduit for zonal student welfare & bursary assistance</span>
                </div>
                <div className="kys-feature-item">
                  <FaCheckCircle className="feat-icon" />
                  <span>Prompt conflict resolution and institutional representation</span>
                </div>
              </div>

              <div className="kys-cta-row">
                <Link to="/register" className="kys-register-btn">
                  Register on KYS Portal Now <FaArrowRight />
                </Link>
                <Link to="/verify-status" className="kys-status-btn">
                  Check Verification Status
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MEDIA GALLERY ================= */}
      <section className="media-gallery-section" id="media">
        <div className="container">
          <div className="section-title-wrap">
            <span className="badge-tag">Visual Archives</span>
            <h2 className="section-title">Media & Campus Gallery</h2>
            <p className="section-subtext">Moments of official engagements, student outreach, and institutional summits</p>
          </div>

          <div className="gallery-masonry">
            <div className="gallery-item" onClick={() => setActiveMedia({ url: proImage, caption: "Official Engagement - Comrade Tope Olugbemi" })}>
              <img src={proImage} alt="Official Engagement" loading="lazy" />
              <div className="gallery-overlay">
                <span>View Full Size</span>
              </div>
            </div>
            <div className="gallery-item" onClick={() => setActiveMedia({ url: ideological, caption: "NANS Southwest Zone D Strategic Summit" })}>
              <img src={ideological} alt="Strategic Summit" loading="lazy" />
              <div className="gallery-overlay">
                <span>View Full Size</span>
              </div>
            </div>
            <div className="gallery-item" onClick={() => setActiveMedia({ url: nansLogo, caption: "Official Crest of NANS" })}>
              <img src={nansLogo} alt="Official Crest" loading="lazy" />
              <div className="gallery-overlay">
                <span>View Full Size</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeMedia && (
        <div className="lightbox-backdrop" onClick={() => setActiveMedia(null)}>
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setActiveMedia(null)}>
              <FaTimes />
            </button>
            <img src={activeMedia.url} alt="Expanded Media" />
            {activeMedia.caption && <p className="lightbox-caption">{activeMedia.caption}</p>}
          </div>
        </div>
      )}

      {/* ================= CONTACT / COMPLAINTS FORM ================= */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info-col">
              <span className="badge-tag">Direct Communication</span>
              <h2>Contact the Office of the PRO</h2>
              <p>
                Have a complaint, suggestion, campus issue, or media inquiry? Send a direct dispatch to the Office of the Public Relations Officer. Every submission is recorded and reviewed.
              </p>

              <div className="contact-channels">
                <div className="channel-item">
                  <FaEnvelope className="chan-icon" />
                  <div>
                    <h5>Official Email</h5>
                    <p>nanszonedpro26@gmail.com</p>
                  </div>
                </div>
                <div className="channel-item">
                  <FaMapMarkerAlt className="chan-icon" />
                  <div>
                    <h5>Secretariat</h5>
                    <p>Southwest Zone D Secretariat (Lagos, Ogun, Oyo, Osun, Ondo, Ekiti)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-col">
              <form className="dynamic-contact-form" onSubmit={handleContactSubmit}>
                <h3>Submit an Inquiry or Complaint</h3>

                <div className="form-group-row">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={contactForm.fullName}
                      onChange={handleContactChange}
                      placeholder="e.g. Adebayo Olumide"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-field">
                    <label>Institution / Campus *</label>
                    <input
                      type="text"
                      name="school"
                      value={contactForm.school}
                      onChange={handleContactChange}
                      placeholder="e.g. UNILAG, OAU, FUTA, MAPOLY"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Academic Level</label>
                    <input
                      type="text"
                      name="level"
                      value={contactForm.level}
                      onChange={handleContactChange}
                      placeholder="e.g. 300 Level, HND II"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Complaint / Message *</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Provide details about your inquiry, issue, or complaint..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn" disabled={submittingContact}>
                  {submittingContact ? "Submitting to Secretariat..." : <><FaPaperPlane /> Submit to Office of the PRO</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top-grid">
            <div className="footer-brand">
              <div className="footer-logo-row">
                <img src={nansLogo} alt="NANS Logo" />
                <div>
                  <h4>NANS SOUTHWEST ZONE D</h4>
                  <p>Office of the Public Relations Officer</p>
                </div>
              </div>
              <p className="footer-desc">
                Serving the student community across 6 SouthWest states with proactive communication, institutional representation, and leadership accountability.
              </p>
            </div>

            <div className="footer-nav-col">
              <h5>Quick Links</h5>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about-us">About & Leadership</Link></li>
                <li><Link to="/headlines">News Releases</Link></li>
                <li><Link to="/register">KYS Student Portal</Link></li>
                <li><Link to="/verify-status">Check Verification Status</Link></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h5>Administration</h5>
              <ul>
                <li><Link to="/blogadmin/login">Central Admin CMS</Link></li>
                <li><Link to="/login">KYS Student Portal Admin</Link></li>
                <li><Link to="/blogger/login">Blogger Sign In</Link></li>
                <li><a href="#contact">Contact Secretariat</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-row">
            <p>© {new Date().getFullYear()} NANS SOUTHWEST — Office of the Public Relations Officer. All Rights Reserved.</p>
            <p className="footer-motto">Integrity • Advocacy • Student Welfare</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
