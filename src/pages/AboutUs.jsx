import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Navbarr from "../components/Navbarr";
import { FaUserTie, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaTimes, FaGlobe } from "react-icons/fa";
import "../styles/homepage.css";
import "../styles/about-us.css";

// Fallback images
import nansLogo from "../assets/download__4_-removebg-preview.png";
import ideological from "../assets/WhatsApp Image 2026-02-05 at 2.35.01 PM.jpeg";
import proImage from "../assets/IMG_2842.JPG";
import osunPro from "../assets/COMR IBRAHEEM.jpeg";
import lagosPro from "../assets/Comrade Ridwan.jpeg";
import oyoPro from "../assets/COMRADE. ADEYANJU.jpeg";
import ondoPro from "../assets/JOHNPAU.jpeg";
import ekitiPro from "../assets/AD Smart.jpeg";
import ogunPro from "../assets/Celebrity Farmer.jpeg";

const fallbackPhotoMap = {
  "Comrade Tope Olugbemi (Celebrity Surveyor)": proImage,
  "Comrade Ibraheem Ayomide Alabi (IB POL)": osunPro,
  "Comrade Ridwan Ajayi": lagosPro,
  "Johnpaul Olamakinde Alabi (Makins)": ondoPro,
  "Comrade Adeyanju Joshua (Aniyikaye)": oyoPro,
  "Comr Sodiq Hassan (Celebrity Farmer)": ogunPro,
  "Comrade Adesipe Smart Ayodeji F. (AD Smart)": ekitiPro,
};

const initialLeaders = [
  {
    _id: "exec-pro",
    fullName: "Comrade Tope Olugbemi (Celebrity Surveyor)",
    position: "Public Relations Officer (PRO), NANS Zone-D",
    category: "Executive",
    state: "Southwest Zone D",
    photo: proImage,
    biography: "Comrade Tope Olugbemi is a young leader known for responsibility, integrity, and a clear sense of purpose. Popularly called the 'Celebrity Surveyor', he brings precision, structure, and forward thinking into both his profession and his leadership.",
    portfolio: "Institutional communications, external affairs, student welfare advocacy, and strategic zonal partnerships across all SouthWest tertiary institutions.",
    responsibilities: [
      "Serving as the official spokesperson and communication bridge of NANS Southwest Zone D.",
      "Promoting constructive student-government-institution dialogue.",
      "Spearheading the Know Your Student (KYS) data and welfare initiative.",
      "Facilitating educational and empowerment partnerships for students across the zone."
    ]
  },
  {
    _id: "pro-lagos",
    fullName: "Comrade Ridwan Ajayi",
    position: "PRO, NANS JCC LAGOS",
    category: "State PRO",
    state: "Lagos State",
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
    category: "State PRO",
    state: "Ogun State",
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
    category: "State PRO",
    state: "Oyo State",
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
    category: "State PRO",
    state: "Osun State",
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
    category: "State PRO",
    state: "Ondo State",
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
    category: "State PRO",
    state: "Ekiti State",
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

const AboutUs = () => {
  const [orgInfo, setOrgInfo] = useState(null);
  const [leaders, setLeaders] = useState(initialLeaders);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const [orgRes, leadRes] = await Promise.all([
          axios.get(`${API_URL}/org-info`).catch(() => null),
          axios.get(`${API_URL}/leadership`).catch(() => null),
        ]);

        if (orgRes?.data?.orgInfo) {
          setOrgInfo(orgRes.data.orgInfo);
        }

        if (leadRes?.data?.profiles && Array.isArray(leadRes.data.profiles) && leadRes.data.profiles.length > 0) {
          const merged = leadRes.data.profiles.map(p => {
            const matchedPhoto = p.photo || fallbackPhotoMap[p.fullName];
            // Only match defaultObj by exact name for fallback photo
            const defaultObj = initialLeaders.find(
              d => (d.fullName || "").toLowerCase().trim() === (p.fullName || "").toLowerCase().trim()
            );

            // If Admin does not include Biography, Portfolio & Core Focus, Key Responsibilities, KEEP BLANK!
            // Never fall back to another person's details
            const cleanBio = p.biography && typeof p.biography === "string" ? p.biography.trim() : "";
            const cleanPort = p.portfolio && typeof p.portfolio === "string" ? p.portfolio.trim() : "";
            let cleanResp = [];
            if (Array.isArray(p.responsibilities)) {
              cleanResp = p.responsibilities.filter(r => Boolean(r && r.trim()));
            } else if (typeof p.responsibilities === "string" && p.responsibilities.trim()) {
              cleanResp = p.responsibilities.split("\n").map(r => r.trim()).filter(Boolean);
            }

            return {
              ...p,
              photo: matchedPhoto || (defaultObj ? defaultObj.photo : nansLogo),
              biography: cleanBio,
              portfolio: cleanPort,
              responsibilities: cleanResp
            };
          });
          setLeaders(merged);
        }
      } catch (err) {
        console.error("Error loading about & leadership data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const isAppointeeOfficer = (l) =>
    Boolean(l.isAppointee) ||
    l.category === "Appointee" ||
    l.category === "Appointee (Office of the PRO)" ||
    l.category === "Special Assistant" ||
    l.category === "Senior Special Assistant" ||
    l.category === "Director" ||
    l.category === "Deputy Director" ||
    l.category === "Media Aide" ||
    (l.position && (
      l.position.toLowerCase().includes("appointee") ||
      l.position.toLowerCase().includes("special assistant") ||
      l.position.toLowerCase().includes("aide") ||
      l.position.toLowerCase().includes("chief of staff")
    ));

  const isStatePro = (l) =>
    (l.category === "State PRO" || (l.position && l.position.includes("JCC"))) &&
    !isAppointeeOfficer(l);

  const sortByHierarchy = (list) => {
    return [...list].sort((a, b) => {
      const orderA = a.displayPriority !== undefined ? Number(a.displayPriority) : 999;
      const orderB = b.displayPriority !== undefined ? Number(b.displayPriority) : 999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.fullName || "").localeCompare(b.fullName || "");
    });
  };

  const executives = sortByHierarchy(
    leaders.filter(
      (l) => (l.category === "Executive" || l._id === "exec-pro") && !isAppointeeOfficer(l) && !isStatePro(l)
    )
  );
  const appointees = sortByHierarchy(leaders.filter((l) => isAppointeeOfficer(l)));
  const statePros = sortByHierarchy(leaders.filter((l) => isStatePro(l)));
  const otherPersonnel = sortByHierarchy(
    leaders.filter(
      (l) => !executives.some(e => e._id === l._id) && 
             !appointees.some(a => a._id === l._id) && 
             !statePros.some(s => s._id === l._id)
    )
  );

  return (
    <div className="about-us-page">
      <Helmet>
        <title>About Us & Leadership Directory | NANS Southwest Zone D</title>
        <meta
          name="description"
          content="Learn about the Office of the Public Relations Officer, NANS Southwest Zone D. Explore our executive leadership, state PROs, ideological foundation, and history."
        />
        <link rel="canonical" href="https://officeoftheprozoned.com/about-us" />
      </Helmet>

      <Navbarr />

      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero-content">
            <img src={nansLogo} alt="NANS Logo" className="hero-logo" />
            <span className="badge-tag">Institutional Profile</span>
            <h1 className="hero-title">About the Office of the PRO</h1>
            <h2 className="hero-subtitle">National Association of Nigerian Students (NANS) — Southwest Zone D</h2>
            <p className="hero-description">
              The communication and advocacy heartbeat representing students across tertiary institutions in Lagos, Ogun, Oyo, Osun, Ondo, and Ekiti States.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="about-mv-section">
        <div className="container">
          <h2 className="section-title">Our Foundational Ideals</h2>
          <p className="section-subtext">The pillars guiding our advocacy, dialogue, and student representation</p>

          <div className="ideals-grid">
            <div className="ideal-card">
              <div className="ideal-icon-circle">🎯</div>
              <h3>Our Vision</h3>
              <p>
                {orgInfo?.vision ||
                  "To build a well-informed, responsible, and empowered student community that actively contributes to national growth and development."}
              </p>
            </div>

            <div className="ideal-card">
              <div className="ideal-icon-circle">📢</div>
              <h3>Our Mission</h3>
              <p>
                {orgInfo?.mission ||
                  "To strengthen communication, promote meaningful engagement, and establish trust between student leaders and the communities they serve."}
              </p>
            </div>

            <div className="ideal-card">
              <div className="ideal-icon-circle">⚖️</div>
              <h3>Our Values</h3>
              <p>
                Transparency, accountability, proactive engagement, and student welfare are the bedrock of all our institutional actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guiding Ideology */}
      <section className="ideology-section">
        <div className="container">
          <div className="ideology-grid">
            <div className="ideology-image-wrap">
              <img src={ideological} alt="NANS Ideology" className="ideology-img" />
            </div>

            <div className="ideology-text-wrap">
              <span className="badge-tag">Philosophy & Struggle</span>
              <h2>{orgInfo?.ideology?.title || "Our Guiding Ideology"}</h2>
              <p>
                {orgInfo?.ideology?.content ||
                  "NANS Southwest Zone-D champions the principles of integrity, service, and active participation. We believe that students are the heartbeat of national transformation and deserve a voice in shaping the policies that affect them. Our ideology promotes youth empowerment, leadership development, and a collective effort to build a nation where education, innovation, and accountability thrive."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="history-section">
        <div className="container">
          <div className="history-box">
            <span className="badge-tag">Legacy of Service</span>
            <h2>{orgInfo?.history?.title || "Our History"}</h2>
            <p>
              {orgInfo?.history?.content ||
                "NANS Southwest Zone-D carries a long-standing tradition of defending student rights, promoting youth integration in governance, and shaping leaders who continue to influence society today. The Office of the Public Relations Officer has consistently served as the bridge between leadership and students—ensuring accurate information, promoting active involvement, and amplifying the voices of young Nigerians across institutions."}
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Directory Section */}
      <section className="leadership-directory-section" id="leadership">
        <div className="container">
          <div className="section-header-center">
            <span className="badge-tag">Official Administration 2026–2027</span>
            <h2 className="section-title">Leadership & Executive Directory</h2>
            <p className="section-subtext">Meet the officers, appointees, and communicators representing students across the Zone</p>

            {/* Quick jump navigation */}
            <div className="leadership-subnav">
              <a href="#executives" className="leadership-subnav-btn">
                Executive Leadership
              </a>
              <a href="#appointees" className="leadership-subnav-btn">
                Office of the PRO Appointees ({appointees.length})
              </a>
              <a href="#state-pros" className="leadership-subnav-btn">
                State JCC PROs ({statePros.length})
              </a>
            </div>
          </div>

          {/* Executive Section */}
          {executives.length > 0 && (
            <div className="leadership-group" id="executives">
              <h3 className="group-title">Executive Leadership</h3>
              <div className="leaders-grid">
                {executives.map((officer) => (
                  <div key={officer._id} className="leader-card featured" onClick={() => setSelectedLeader(officer)}>
                    <div className="leader-photo-wrap">
                      <img
                        src={officer.photo || fallbackPhotoMap[officer.fullName] || proImage}
                        alt={officer.fullName}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = proImage;
                        }}
                      />
                      <span className="leader-badge">Zonal Executive</span>
                    </div>
                    <div className="leader-info">
                      <h4 className="leader-name">{officer.fullName}</h4>
                      <p className="leader-position">{officer.position}</p>
                      {officer.state && <p className="leader-state"><FaMapMarkerAlt /> {officer.state}</p>}
                      <button className="view-portfolio-btn" onClick={(e) => { e.stopPropagation(); setSelectedLeader(officer); }}>
                        View Portfolio & Bio →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dedicated Section: Appointees of the Office of the PRO */}
          <div className="leadership-group appointees-group" id="appointees">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px", marginBottom: "25px" }}>
              <div>
                <span className="badge-tag" style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", marginBottom: "8px", display: "inline-block" }}>
                  Official Office of the PRO Appointments
                </span>
                <h3 className="group-title" style={{ margin: 0 }}>Appointees of the Office of the PRO</h3>
                <p style={{ color: "#475569", fontSize: "0.95rem", marginTop: "6px", maxWidth: "750px" }}>
                  Aides, Directors, Special Assistants, and Senior Special Assistants officially appointed to champion student advocacy, media communication, and strategic governance in the Office of the PRO.
                </p>
              </div>
              <span style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", padding: "6px 14px", borderRadius: "9999px", fontSize: "0.85rem", fontWeight: "700" }}>
                {appointees.length} Official {appointees.length === 1 ? "Appointee" : "Appointees"}
              </span>
            </div>

            {appointees.length > 0 ? (
              <div className="leaders-grid">
                {appointees.map((officer) => (
                  <div key={officer._id} className="leader-card appointee-card" onClick={() => setSelectedLeader(officer)}>
                    <div className="leader-photo-wrap">
                      <img
                        src={officer.photo || fallbackPhotoMap[officer.fullName] || nansLogo}
                        alt={officer.fullName}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = nansLogo;
                        }}
                      />
                      <span className="leader-badge appointee-badge">PRO Appointee</span>
                    </div>
                    <div className="leader-info">
                      <h4 className="leader-name">{officer.fullName}</h4>
                      <p className="leader-position">{officer.position}</p>
                      {officer.state && <p className="leader-state"><FaMapMarkerAlt /> {officer.state}</p>}
                      <button className="view-portfolio-btn" onClick={(e) => { e.stopPropagation(); setSelectedLeader(officer); }}>
                        View Profile & Bio →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="appointees-empty-state">
                <FaUserTie style={{ fontSize: "2.4rem", color: "#16a34a", marginBottom: "12px" }} />
                <h4 style={{ fontSize: "1.1rem", color: "#1e293b", marginBottom: "6px" }}>Appointee Directory</h4>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Official appointees of the Office of the PRO will appear here once appointed and published by the Secretariat.
                </p>
              </div>
            )}
          </div>

          {/* State Joint Campus Committee (JCC) PROs */}
          {statePros.length > 0 && (
            <div className="leadership-group" id="state-pros">
              <h3 className="group-title">State Joint Campus Committee (JCC) PROs</h3>
              <div className="leaders-grid">
                {statePros.map((officer) => (
                  <div key={officer._id} className="leader-card" onClick={() => setSelectedLeader(officer)}>
                    <div className="leader-photo-wrap">
                      <img
                        src={officer.photo || fallbackPhotoMap[officer.fullName] || nansLogo}
                        alt={officer.fullName}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = nansLogo;
                        }}
                      />
                      <span className="leader-badge state-badge">{officer.state || "State PRO"}</span>
                    </div>
                    <div className="leader-info">
                      <h4 className="leader-name">{officer.fullName}</h4>
                      <p className="leader-position">{officer.position}</p>
                      {officer.state && <p className="leader-state"><FaMapMarkerAlt /> {officer.state}</p>}
                      <button className="view-portfolio-btn" onClick={(e) => { e.stopPropagation(); setSelectedLeader(officer); }}>
                        View Portfolio & Bio →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Directorate & Media Personnel */}
          {otherPersonnel.length > 0 && (
            <div className="leadership-group">
              <h3 className="group-title">Directorate & Media Personnel</h3>
              <div className="leaders-grid">
                {otherPersonnel.map((officer) => (
                  <div key={officer._id} className="leader-card" onClick={() => setSelectedLeader(officer)}>
                    <div className="leader-photo-wrap">
                      <img
                        src={officer.photo || nansLogo}
                        alt={officer.fullName}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = nansLogo;
                        }}
                      />
                    </div>
                    <div className="leader-info">
                      <h4 className="leader-name">{officer.fullName}</h4>
                      <p className="leader-position">{officer.position}</p>
                      <button className="view-portfolio-btn" onClick={(e) => { e.stopPropagation(); setSelectedLeader(officer); }}>
                        Profile Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Leadership Profile Modal */}
      {selectedLeader && (
        <div className="modal-backdrop" onClick={() => setSelectedLeader(null)}>
          <div className="leader-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedLeader(null)} title="Close Profile">
              <FaTimes />
            </button>

            {/* Profile Header Row */}
            <div className="modal-header-profile">
              <div className="modal-avatar-wrapper">
                <img
                  src={selectedLeader.photo || fallbackPhotoMap[selectedLeader.fullName] || proImage}
                  alt={selectedLeader.fullName}
                  className="modal-avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = nansLogo;
                  }}
                />
                {(selectedLeader.isAppointee || selectedLeader.category === "Appointee" || selectedLeader.category === "Appointee (Office of the PRO)") && (
                  <span className="modal-avatar-badge">Appointee</span>
                )}
              </div>
              <div className="modal-header-info">
                <span className="modal-role-tag">
                  {selectedLeader.category || "Official Profile"}
                </span>
                <h3 className="modal-name">{selectedLeader.fullName}</h3>
                <p className="modal-position">{selectedLeader.position}</p>
                <div className="modal-meta-row">
                  {selectedLeader.state && (
                    <span className="modal-meta-item">
                      <FaMapMarkerAlt className="meta-icon" /> {selectedLeader.state}
                    </span>
                  )}
                  {selectedLeader.administration && (
                    <span className="modal-meta-item">
                      <FaUserTie className="meta-icon" /> Administration {selectedLeader.administration}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="modal-body-content">
              {/* If Admin does not include Biography, Portfolio & Core Focus, and Key Responsibilities, show clear message */}
              {!selectedLeader.biography && !selectedLeader.portfolio && (!selectedLeader.responsibilities || selectedLeader.responsibilities.length === 0) ? (
                <div className="modal-empty-details">
                  <div className="empty-icon-circle">📜</div>
                  <h4>Official Portfolio Registered</h4>
                  <p>
                    Full biographical background, core portfolio focus, and specific duties for this office have not been uploaded by the administration.
                  </p>
                </div>
              ) : (
                <>
                  {selectedLeader.biography && (
                    <div className="modal-section">
                      <div className="modal-section-title-wrap">
                        <span className="section-pill-icon">👤</span>
                        <h4>Biography & Background</h4>
                      </div>
                      <p className="modal-text">{selectedLeader.biography}</p>
                    </div>
                  )}

                  {selectedLeader.portfolio && (
                    <div className="modal-section">
                      <div className="modal-section-title-wrap">
                        <span className="section-pill-icon">🎯</span>
                        <h4>Portfolio & Core Focus</h4>
                      </div>
                      <p className="modal-text">{selectedLeader.portfolio}</p>
                    </div>
                  )}

                  {selectedLeader.responsibilities && selectedLeader.responsibilities.length > 0 && (
                    <div className="modal-section">
                      <div className="modal-section-title-wrap">
                        <span className="section-pill-icon">⚡</span>
                        <h4>Key Responsibilities & Scope</h4>
                      </div>
                      <ul className="modal-responsibilities">
                        {selectedLeader.responsibilities.map((r, i) => (
                          <li key={i}>
                            <FaCheckCircle className="check-bullet" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
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
                <li><Link to="/#contact">Contact Secretariat</Link></li>
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

export default AboutUs;
