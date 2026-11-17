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
            const defaultObj = initialLeaders.find(
              d => d.fullName.toLowerCase().includes(p.fullName.toLowerCase()) || 
                   (p.state && d.state && d.state.toLowerCase().includes(p.state.toLowerCase()))
            );
            return {
              ...p,
              photo: matchedPhoto || defaultObj?.photo || nansLogo,
              biography: p.biography || defaultObj?.biography || "",
              portfolio: p.portfolio || defaultObj?.portfolio || "",
              responsibilities: (p.responsibilities && p.responsibilities.length > 0) ? p.responsibilities : defaultObj?.responsibilities || []
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

  const executives = leaders.filter((l) => l.category === "Executive");
  const statePros = leaders.filter((l) => l.category === "State PRO" || (l.position && l.position.includes("JCC")));
  const mediaAndAides = leaders.filter((l) => l.category !== "Executive" && l.category !== "State PRO" && !(l.position && l.position.includes("JCC")));

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
            <p className="section-subtext">Meet the officers and communicators representing students across the Zone</p>
          </div>

          {/* Executive Section */}
          {executives.length > 0 && (
            <div className="leadership-group">
              <h3 className="group-title">Executive Leadership</h3>
              <div className="leaders-grid">
                {executives.map((officer) => (
                  <div key={officer._id} className="leader-card featured" onClick={() => setSelectedLeader(officer)}>
                    <div className="leader-photo-wrap">
                      <img
                        src={officer.photo || fallbackPhotoMap[officer.fullName] || proImage}
                        alt={officer.fullName}
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

          {/* State Joint Campus Committee (JCC) PROs */}
          {statePros.length > 0 && (
            <div className="leadership-group">
              <h3 className="group-title">State Joint Campus Committee (JCC) PROs</h3>
              <div className="leaders-grid">
                {statePros.map((officer) => (
                  <div key={officer._id} className="leader-card" onClick={() => setSelectedLeader(officer)}>
                    <div className="leader-photo-wrap">
                      <img
                        src={officer.photo || fallbackPhotoMap[officer.fullName] || nansLogo}
                        alt={officer.fullName}
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

          {/* Media Team & Appointees */}
          {mediaAndAides.length > 0 && (
            <div className="leadership-group">
              <h3 className="group-title">Directors, Aides & Media Personnel</h3>
              <div className="leaders-grid">
                {mediaAndAides.map((officer) => (
                  <div key={officer._id} className="leader-card" onClick={() => setSelectedLeader(officer)}>
                    <div className="leader-photo-wrap">
                      <img src={officer.photo || nansLogo} alt={officer.fullName} />
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
            <button className="modal-close-btn" onClick={() => setSelectedLeader(null)}>
              <FaTimes />
            </button>

            <div className="modal-header-profile">
              <img
                src={selectedLeader.photo || fallbackPhotoMap[selectedLeader.fullName] || proImage}
                alt={selectedLeader.fullName}
                className="modal-avatar"
              />
              <div>
                <h3>{selectedLeader.fullName}</h3>
                <p className="modal-position">{selectedLeader.position}</p>
                {selectedLeader.state && (
                  <p className="modal-state">
                    <FaMapMarkerAlt /> {selectedLeader.state}
                  </p>
                )}
              </div>
            </div>

            <div className="modal-body-content">
              {selectedLeader.biography && (
                <div className="modal-section">
                  <h4>Biography</h4>
                  <p>{selectedLeader.biography}</p>
                </div>
              )}

              {selectedLeader.portfolio && (
                <div className="modal-section">
                  <h4>Portfolio & Core Focus</h4>
                  <p>{selectedLeader.portfolio}</p>
                </div>
              )}

              {selectedLeader.responsibilities && selectedLeader.responsibilities.length > 0 && (
                <div className="modal-section">
                  <h4>Key Responsibilities</h4>
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
