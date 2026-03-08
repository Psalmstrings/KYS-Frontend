import React from "react";
import "../index.css";
import ideological from "../assets/WhatsApp Image 2026-02-05 at 2.35.01 PM.jpeg"; // Add actual ideological image here
import nansLogo from "../assets/download__4_-removebg-preview.png";
import proImage from "../assets/IMG_2842.JPG"; // Add actual PRO image here
import osunPro from "../assets/COMR IBRAHEEM.jpeg"; // Add actual Osun PRO image here
import osunPro2 from "../assets/Comrade Ridwan.jpeg"; // Add actual Osun PRO image here
import osunPro3 from "../assets/COMRADE. ADEYANJU.jpeg"; // Add actual Osun PRO image here
import osunPro4 from "../assets/JOHNPAU.jpeg"; // Add actual Osun PRO image here

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
            <h4>(Celebrity Surveyor)</h4><br />
            <p>
              <span>A Voice, A Vision, A Responsibility </span><br />
              Comrade Tope Olugbemi is a young leader known for responsibility, integrity, and a clear sense of purpose. Popularly called the “Celebrity Surveyor,” he brings precision, structure, and forward thinking into both his profession and his leadership.

              Tope believes leadership is more than a title. To him, it is a responsibility to serve others and create real value. His approach focuses on accountability, thoughtful decisions, and staying committed to doing what is right even under pressure.

              He is a strong advocate for youth participation in governance, enterprise, and national development. Through his work, he encourages young people not only to speak up but also to be prepared, capable, and relevant in shaping the future.

              Known for his consistency and character, Tope Olugbemi represents a generation determined to move beyond excuses and focus on building practical solutions for society.
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

      

      <section className="media">
        <h2>Media Team</h2>
        <div className="media-grid">
          <div className="media-card">
            <img src={osunPro} alt="" />
            <h3>COMR IBRAHEEM AYOMIDE ALABI (PKA: IB POL)</h3>
            <h6>NANS PRO OSUN</h6>
          </div>
          <div className="media-card">
            <img src={osunPro2} alt="" />
            <h3>COMR IBRAHEEM AYOMIDE ALABI (PKA: IB POL)</h3>
            <h6>NANS PRO OSUN</h6>
          </div>
          <div className="media-card">
            <img src={osunPro3} alt="" />
            <h3>COMR IBRAHEEM AYOMIDE ALABI (PKA: IB POL)</h3>
            <h6>NANS PRO OSUN</h6>
          </div>
          <div className="media-card">
            <img src={osunPro4} alt="" />
            <h3>COMR IBRAHEEM AYOMIDE ALABI (PKA: IB POL)</h3>
            <h6>NANS PRO OSUN</h6>
          </div>
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

      {/* GALLERY */}
      <section className="gallery">
        <h2>Media Gallery</h2>
        <div className="gallery-grid">
          <img src={nansLogo} alt="gallery" />
          <img src={ideological} alt="gallery" />
          {/* <img src={proImage} alt="gallery" /> */}
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} NANS SOUTHWEST — Office of the PRO.
      </footer>

    </div>
  );
};

export default Homepage;