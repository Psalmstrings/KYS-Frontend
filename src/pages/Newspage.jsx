import React from "react";
import "../styles/homepage.css";
import nansLogo from "../assets/download__4_-removebg-preview.png";
import ideological from "../assets/WhatsApp Image 2026-02-05 at 2.35.01 PM.jpeg";
import proImage from "../assets/IMG_2842.JPG";
import osunPro from "../assets/COMR IBRAHEEM.jpeg";
import osunPro2 from "../assets/Comrade Ridwan.jpeg";
import osunPro3 from "../assets/COMRADE. ADEYANJU.jpeg";
import osunPro4 from "../assets/JOHNPAU.jpeg";
import Navbarr from "../components/Navbarr";
import NewsHeadlines from "../components/NewsHeadline";

const NewsPage = () => {
  return (
    <div className="about-us-page">
      <Navbarr />

      {/* HERO SECTION */}
    <section className="hero-section fade-in">
      <div className="hero-grid">
        <div className="hero-text slide-up">
          <img src={nansLogo} alt="NANS Logo" className="hero-logo" />
    
          <h1 className="hero-title">NANS SouthWest — ZONE D</h1>
          <h2 className="hero-subtitle">Office of the Public Relations Officer</h2>
          <p className="hero-description">
            Promoting Transparency, Engagement & Effective Communication Across SouthWest Campuses.
          </p>
    
          <button
            className="hero-btn"
            onClick={() => (window.location.href = "/register")}
          >
            KYS Registration Now Open →
          </button>
        </div>
    
        <div>
           {/* Right mock card */}
            <div className="hero-mock">
              
            </div>
    
            {/* Floating background shapes */}
            <div className="shape shape1"></div>
            <div className="shape shape2"></div>
            <div className="shape shape3"></div>
            <div className="shape shape4"></div>
        </div>
    
        {/* <div className="hero-image-container zoom-in">
          <img src={proImage} alt="PRO" className="hero-main-img" />
        </div> */}
      </div>
    </section>

     
         {/* **News** */}

    <NewsHeadlines />

      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} NANS SOUTHWEST — Office of the PRO.
      </footer>
    </div>
  );
};

export default NewsPage;