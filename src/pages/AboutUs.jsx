import React from "react";
import "../styles/homepage.css";
import nansLogo from "../assets/download__4_-removebg-preview.png";
import ideological from "../assets/WhatsApp Image 2026-02-05 at 2.35.01 PM.jpeg";
import proImage from "../assets/IMG_2842.JPG";
import osunPro from "../assets/COMR IBRAHEEM.jpeg";
import osunPro2 from "../assets/Comrade Ridwan.jpeg";
import osunPro3 from "../assets/COMRADE. ADEYANJU.jpeg";
import osunPro4 from "../assets/JOHNPAU.jpeg";
import osunPro5 from "../assets/AD Smart.jpeg";
import osunPro6 from "../assets/Celebrity Farmer.jpeg";
import Navbarr from "../components/Navbarr";

const AboutUs = () => {
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

      {/* **MISSION & VISION** */}
      <section className="about-mv fade-in">
        <h2 className="section-title">Our Core Ideals</h2>


        <div className="about-grid">
          <div className="about-card slide-up">
            <h3>Our Vision</h3>
            <p>
              To build a well-informed, responsible, and empowered student
              community that actively contributes to national growth and
              development.
            </p>
          </div>

          <div className="about-card slide-up">
            <h3>Our Mission</h3>
            <p>
              To strengthen communication, promote meaningful engagement,
              and establish trust between student leaders and the
              communities they serve.
            </p>
          </div>

          <div className="about-card slide-up">
            <h3>Our Values</h3>
            <p>
              Transparency, accountability, collaboration, and youth
              empowerment are the foundation of everything we stand for.
            </p>
          </div>
        </div>
      </section>

      {/* IDEOLOGY SECTION */}
      <section className="ideology-section fade-in">
        <div className="ideology-grid">
          <div className="zoom-in">
            <img src={ideological} alt="Ideology" className="ideology-img" />
          </div>

          <div className="slide-up ideology-text">
            <h2>Our Guiding Ideology</h2>
            <p>
              NANS Southwest Zone-D champions the principles of integrity,
              service, and active participation. We believe that students
              are the heartbeat of national transformation and deserve a
              voice in shaping the policies that affect them.
              <br /><br />
              Our ideology promotes youth empowerment, leadership development,
              and a collective effort to build a nation where education,
              innovation, and accountability thrive.
            </p>
          </div>
        </div>
      </section>

    

      {/* HISTORY SECTION */}
      <section className="history-section fade-in">
        <h2 className="section-title">Our History</h2>
        <p className="section-subtext">
          A legacy of advocacy, leadership, and student activism.
        </p>

        <p className="history-text slide-up">
          NANS Southwest Zone-D carries a long-standing tradition of defending
          student rights, promoting youth integration in governance, and
          shaping leaders who continue to influence society today.  
          <br /><br />
          The Office of the Public Relations Officer has consistently served as
          the bridge between leadership and students—ensuring accurate
          information, promoting active involvement, and amplifying the voices
          of young Nigerians across institutions.
        </p>
      </section>

      {/* MEDIA TEAM */}
      
        <h2 className="section-title">Media Team</h2>
        <p className="section-subtext">The creative minds supporting the voice of the Zone</p>

        <div className="media-grid">
          <div className="media-card slide-up">
            <img src={osunPro} alt="OSUN PRO" />
            <h3>COMR IBRAHEEM AYOMIDE ALABI (IB POL)</h3>
            <h6>PRO, NANS JCC OSUN</h6>
          </div>

          <div className="media-card slide-up">
            <img src={osunPro2} alt="LAGOS PRO" />
            <h3>COMRADE RIDWAN AJAYI</h3>
            <h6>PRO, NANS JCC LAGOS</h6>
          </div>

          <div className="media-card slide-up">
            <img src={osunPro4} alt="ONDO PRO" />
            <h3>JOHNPAUL OLAMAKINDE ALABI (MAKINS)</h3>
            <h6>PRO, NANS JCC ONDO</h6>
          </div>

          <div className="media-card slide-up">
            <img src={osunPro3} alt="OYO PRO" />
            <h3>COMRADE ADEYANJU JOSHUA (ANIYIKAYE)</h3>
            <h6>PRO, NANS JCC OYO</h6>
          </div>

          <div className="media-card slide-up">
            <img src={osunPro6} alt="OYO PRO" />
            <h3>COMR SODIQ HASSAN(CELEBRITY FARMER)</h3>
            <h6>PRO, NANS JCC OGUN</h6>
          </div>

          <div className="media-card slide-up">
            <img src={osunPro5} alt="OYO PRO" />
            <h3>COMRADE ADESIPE SMART AYODEJI F.(AD Smart )</h3>
            <h6>PRO, NANS JCC EKITI</h6>
          </div>
        </div>
      

      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} NANS SOUTHWEST — Office of the PRO.
      </footer>
    </div>
  );
};

export default AboutUs;