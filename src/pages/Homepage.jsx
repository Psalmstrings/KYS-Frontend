import React from "react";
import "../index.css";
import nansLogo from "../assets/download__4_-removebg-preview.png";

const Homepage = () => {
  return (
    <div className="homepage">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <img src={nansLogo} alt="Hero Image" />
          <h1>NANS SouthWest — ZONE-D</h1>
          <h2>Office of the Public Relation Officer</h2>
          <p>Promoting Transparency, Engagement & Effective Communication</p>
          <button
                className="register-btn"onClick={() => window.location.href = "/register"}>
                      KYS Registration Now Open
            </button>
        </div>
      </section>


      {/* ABOUT SECTION */}
      <section className="about">
        <h2>The PRO</h2>
        <p>
          The Public Relations Office serves as the communication gateway in the entire SOUTHWEST student community. We ensure 
          that vital information is clear, timely, and accessible to everyone.
        </p>
      </section>


      {/* VISION & MISSION */}
      <section className="vision-mission">
        <div className="vm-card">
          <h3>Our Vision</h3>
          <p>
            To build a well-informed student community empowered through transparent
            and effective communication.
          </p>
        </div>

        <div className="vm-card">
          <h3>Our Mission</h3>
          <p>
            To deliver accurate information, promote student engagement, and 
            strengthen trust.
          </p>
        </div>
      </section>


      {/* NEWS SECTION */}
      <section className="news" id="news">
        <h2>Latest Announcements</h2>

        <div className="news-container">
          <div className="news-card">
            <h4>📢 KYS Registration Now Open</h4>
            {/* <p>Students resgistration.</p> */}
            <button
                className="register-btn"onClick={() => window.location.href = "/register"}>
                      Register Now
            </button>
          </div>

          
        </div>
      </section>


      {/* GALLERY */}
      <section className="gallery">
        <h2>Media Gallery</h2>
        <div className="gallery-grid">
          <img src="../" alt="gallery" />
          <img src="https://source.unsplash.com/400x300?university" alt="gallery" />
          <img src="https://source.unsplash.com/400x300?youth" alt="gallery" />
          <img src="https://source.unsplash.com/400x300?education" alt="gallery" />
        </div>
      </section>


      {/* EXECUTIVES */}
      <section className="executives">
        <h2>Meet Our PRO Team</h2>

        <div className="exec-container">
          <div className="exec-card">
            <img src="https://source.unsplash.com/300x300?person" alt="pro" />
            <h4>John Daniel</h4>
            <p>Chief PRO</p>
          </div>

          <div className="exec-card">
            <img src="https://source.unsplash.com/301x300?portrait" alt="pro" />
            <h4>Sarah Williams</h4>
            <p>Deputy PRO</p>
          </div>

          <div className="exec-card">
            <img src="https://source.unsplash.com/302x300?face" alt="pro" />
            <h4>Michael Brown</h4>
            <p>Media Lead</p>
          </div>
        </div>
      </section>


      {/* CONTACT */}
      <section className="contact">
        <h2>Contact The PRO Office</h2>
        <p>Have questions, complaints, or suggestions? Reach out to us.</p>

        <a href="mailto:prooffice@gmail.com" className="contact-btn">
          Send Email
        </a>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} NANS SOUTHWEST — Office of the PRO.
      </footer>

    </div>
  );
};

export default Homepage;
