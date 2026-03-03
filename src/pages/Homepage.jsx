import React from "react";
import "../index.css";
import ideological from "../assets/WhatsApp Image 2026-02-05 at 2.35.01 PM.jpeg"; // Add actual ideological image here
import nansLogo from "../assets/download__4_-removebg-preview.png";
import proImage from "../assets/IMG_2842.JPG"; // Add actual PRO image here

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
            className="register-btn"
            onClick={() => (window.location.href = "/register")}
          >
            KYS Registration Now Open
          </button>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about">
        <h2>The PRO</h2>
        <p>
          The Public Relations Office serves as the communication gateway in the
          entire SOUTHWEST student community. We ensure that vital information is
          clear, timely, and accessible to everyone.
        </p>
      </section>

      {/* MEET THE PRO */}
      <section className="meet-pro">
        <h2>Meet the PRO</h2>

        <div className="pro-card">
          <img src={proImage} alt="PRO Portrait" className="pro-img" />
          
          <div className="pro-text">
            <h3>Comr. Tope Olugbemi</h3>
            <p>
              <span>A Voice, A Vision, A Responsibility </span><br />
              Comrade Tope Olugbemi is a new-generation leader driven by responsibility, integrity, and measurable impact. Known as the “Celebrity Surveyor,” he embodies precision, structure, and foresight — qualities that define both his profession and his leadership style.

              Tope’s philosophy is simple: leadership is not a title but a burden carried for the benefit of others. He prioritizes value over visibility, choosing strategic thinking, accountability, and principled action even under pressure.

              A firm believer that Nigeria can work — by responsibility, not by chance, he champions youth ownership in governance, enterprise, and national development. His advocacy bridges student leadership with economic empowerment, ensuring young people are not just vocal, but relevant and equipped.

              Integrity is Tope’s strongest currency. In a system where shortcuts are common, he stands out for consistency, credibility, and character. As a communicator, he engages difficult conversations with clarity, diplomacy, and purposeful vision.

              Tope sees leadership as stewardship — a trust to strengthen institutions and shape lasting impact. His journey continues, but his mission remains clear: responsibility over popularity, substance over noise, legacy over applause.

              He represents a generation determined not to inherit excuses, but to build solutions.
            </p>
          </div>
        </div>
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
            <button
              className="register-btn"
              onClick={() => (window.location.href = "/register")}
            >
              Register Now
            </button>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery">
        <h2>Media Gallery</h2>
        <div className="gallery-grid">
          <img src={nansLogo} alt="gallery" />
          <img src={ideological} alt="gallery" />
          {/* <img src={proImage} alt="gallery" /> */}
        </div>
      </section>

      {/* CONTACT SECTION WITH FORM */}
      <section className="contact">
        <h2>Contact The Office of the PRO</h2>
        <p>Submit inquiries, concerns or complaints using the form below.</p>

        <form 
          className="contact-form" 
          action="mailto:nanszonedpro26@gmail.com"
          method="POST"
          encType="text/plain"
        >
          <input type="text" name="Full Name" placeholder="Full Name" required />
          <input type="text" name="School" placeholder="School" required />
          <input type="text" name="Level" placeholder="Level" required />
          <textarea 
            name="Complaint" 
            placeholder="Write your complaint here..." 
            required
          ></textarea>

          <button type="submit" className="contact-btn">
            Submit Complaint
          </button>
        </form>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} NANS SOUTHWEST — Office of the PRO.
      </footer>

    </div>
  );
};

export default Homepage;