import React from "react";
import "../styles/homepage.css";
import ideological from "../assets/WhatsApp Image 2026-02-05 at 2.35.01 PM.jpeg";
import nansLogo from "../assets/download__4_-removebg-preview.png";
import proImage from "../assets/IMG_2842.JPG"; 
import osunPro from "../assets/COMR IBRAHEEM.jpeg"; 
import osunPro2 from "../assets/Comrade Ridwan.jpeg"; 
import osunPro3 from "../assets/COMRADE. ADEYANJU.jpeg"; 
import osunPro4 from "../assets/JOHNPAU.jpeg"; 
import NewsHeadlines from "../components/NewsHeadline";
import Navbarr from "../components/Navbarr";

const Homepage = () => {
  return (
    <div className="homepage">

      {/* NAVBAR */}
      <Navbarr />

      {/* ================= HERO SECTION ================= */}
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

    <div className="shapeeee">
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

      

      {/* ================= ABOUT PRO OFFICE ================= */}
      <section className="about-office fade-in">
        <h2 className="section-title">About The PRO Office</h2>
        <p className="section-subtext">
          The Office of the Public Relations Officer serves as the communication backbone of 
          NANS SouthWest — ensuring accurate information flow, conflict resolution, 
          and improved student-government relations.
        </p>

        <div className="about-grid">
          <div className="about-card slide-up">
            <h3>Communication</h3>
            <p>Timely and clear communication between the leadership and all SouthWest campuses.</p>
          </div>

          <div className="about-card slide-up">
            <h3>Transparency</h3>
            <p>Ensuring students have access to verified, unbiased and transparent information.</p>
          </div>

          <div className="about-card slide-up">
            <h3>Representation</h3>
            <p>Amplifying the voices of students at zonal and national levels.</p>
          </div>
        </div>
      </section>

      {/* ================= NEWS HEADLINES ================= */}
      <NewsHeadlines />

      {/* ================= MEET THE PRO ================= */}
      

      <section className="mandates">
        <h2 className="section-title">KYS Registration</h2>

        <div className="mandate-gridd">
          <div className="mandate-card fade-in">
            <h3>What is KYS?</h3>
            <p>The Southwest PRO of the National Association of Nigerian Students (NANS) has kicked off an exciting new program called “Know Your Students” (KYS). The goal? To bring student leadership closer to the students themselves.

            Too often, leadership can feel distant, making it hard for students to feel heard. KYS is all about changing that, taking the time to listen, understand, and connect with students on a personal level. It’s about knowing their dreams, their challenges, and what really matters to them.

            By engaging directly with students, this initiative ensures that the voices of the student body guide the decisions and programs that affect them. It creates a space where students can share ideas, express concerns, and feel truly seen and represented.

            The KYS initiative shows that leadership isn’t just about making policies, it’s about people. When leaders know their students, they can better support, advocate for, and empower them. With KYS, NANS Southwest is making a promise: to lead with understanding, to listen, and to be closer to the students they serve.</p>
            <button
              className="hero-btn"
              onClick={() => (window.location.href = "/register")}>
              KYS Registration Now Open →
            </button>
          </div>
        </div>
      </section>

      {/* ================= MEDIA TEAM ================= */}
      {/* <section className="media fade-in">
        <h2 className="section-title">Media Team</h2>

        <div className="media-grid">
          

          <div className="media-card slide-up">
            <img src={osunPro2} alt="" />
            <h3>COMRADE RIDWAN AJAYI</h3>
            <h6>PRO, NANS JCC LAGOS</h6>
          </div>

          <div className="media-card slide-up">
            <img src={osunPro4} alt="" />
            <h3>JOHNPAUL OLAMAKINDE ALABI (MAKINS)</h3>
            <h6>PRO, NANS JCC ONDO</h6>
          </div>

          <div className="media-card slide-up">
            <img src={osunPro3} alt="" />
            <h3>COMRADE ADEYANJU JOSHUA (ANIYIKAYE)</h3>
            <h6>PRO, NANS JCC OYO</h6>
          </div>
        </div>
      </section> */}

      <section className="meet-pro fade-in">
        <h2 className="section-title">Meet the PRO</h2>

        <div className="media-cardd slide-up">
            <div>
              <img src={proImage} alt="" className="pro-photo" />
            
            </div>
            <div>
              <h3>TOPE OLUGBEMI (CELEBRITY SURVEYOR)</h3>
              <h4>PRO, NANS ZONE-D</h4>
              <p>A Voice. A Vision. A Responsibility.

                Comrade Tope Olugbemi is a young leader known for responsibility, integrity, and a clear sense of purpose. Popularly called the “Celebrity Surveyor,” he brings precision, structure, and forward thinking into both his profession and his leadership.

                Tope believes leadership is more than a title. To him, it is a responsibility to serve others and create real value. His approach focuses on accountability, thoughtful decisions, and staying committed to doing what is right even under pressure.

                He is a strong advocate for youth participation in governance, enterprise, and national development. Through his work, he encourages young people not only to speak up but also to be prepared, capable, and relevant in shaping the future.

                Known for his consistency and character, Tope Olugbemi represents a generation determined to move beyond excuses and focus on building practical solutions for society
              </p>
            </div>
          </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section className="contact fade-in">
        <h2 className="section-title">Contact The Office of the PRO</h2>
        <p>Submit inquiries, concerns or complaints using the form below.</p>

        <form 
          className="contact-form slide-up"
          action="mailto:nanszonedpro26@gmail.com"
          method="POST"
          encType="text/plain"
        >
          <input type="text" name="Full Name" placeholder="Full Name" required />
          <input type="text" name="School" placeholder="School" required />
          <input type="text" name="Level" placeholder="Level" required />
          <textarea name="Complaint" placeholder="Write your complaint here..." required />

          <button type="submit" className="form-btn">Submit Complaint</button>
        </form>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="gallery fade-in">
        <h2 className="section-title">Media Gallery</h2>

        <div className="gallery-grid">
          <img src={nansLogo} alt="" className="gallery-img zoom-in" />
          <img src={ideological} alt="" className="gallery-img zoom-in" />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        © {new Date().getFullYear()} NANS SOUTHWEST — Office of the PRO.
      </footer>
    </div>
  );
};

export default Homepage;