import React from "react";
import "../index.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Background overlay */}
      <div className="overlay"></div>

      {/* Hero content */}
      <div className="hero-content">
        <div></div>
        <h1 className="title">
          Welcome to the Office of the <br />
          <span className="highlight">Public Relation Officer</span>  
        </h1>
        <h2 className="subtitle">
          <span className="highlight">National Association of Nigeria Students (NANS)</span>
        </h2>
        <p className="zone">South West • Zone D</p>

        <h3 className="initiative">Know Your Student (KYS) Initiative</h3>
        <p className="tagline">“Leadership at your doorstep.”</p>

        <button
          className="register-btn"
          onClick={() => window.location.href = "/register"}
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

export default Home;
