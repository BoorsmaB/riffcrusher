import React from "react";
import { Helmet } from "react-helmet"; // ✅ Import Helmet
import "./AboutMe.css";

function AboutMe() {
  return (
    <div className="aboutme-container">
      {/* ✅ Add Helmet for SEO */}
      <Helmet>
        <title>
          About Us | Jovanaar - Metal Music, Gaming & Content Creation
        </title>
        <meta name="description" content="Learn more about our team! " />
        <meta property="og:title" content="About The Riffcrusher Team!" />
        <meta
          property="og:description"
          content="Learn more from the Riffcrusher team."
        />
        <meta property="og:url" content="https://www.riffcrusher.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="aboutme-header">
        <h1>About Us</h1>
        <h2>"We love everything loud."</h2>
      </div>
      <div className="aboutme-card">
        <img
          src="/assets/jova-avatar.jpg"
          alt="ItsJovanaar"
          className="jova-avatar"
        />
        <div className="aboutme-text">
          <p>
            Hi there. I go by Jovanaar, but you might also know me as "Waanzin"
            from the Blackened-Death metal band "Onheil".
          </p>
          <p>
            I've started this website because I wanted to combine my passion for
            creating metal music, content creation and all my other hobbies.
          </p>
          <p>
            I wanted a space where I could do whatever I want and since
            finishing my Front-End Developing studies, I've got the tools to do
            this myself as well.
          </p>
          <p>
            Keep an eye on this space, because I'm interested in creating a
            community-driven platform bringing everyone together who enjoys loud
            music, scary movies, and video games.
          </p>
          <div className="social-buttons">
            <a
              href="https://www.twitch.tv/ItsJovanaar"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/assets/twitch.png"
                alt="Twitch"
                className="social-icon"
              />
            </a>
            <a
              href="https://www.youtube.com/@ItsJovanaar"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/assets/youtube.png"
                alt="YouTube"
                className="social-icon"
              />
            </a>
            <a
              href="https://www.facebook.com/ItsJovanaar"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/assets/facebook.png"
                alt="Facebook"
                className="social-icon"
              />
            </a>
            <a
              href="https://www.instagram.com/itsjovanaar/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/assets/instagram.png"
                alt="Instagram"
                className="social-icon"
              />
            </a>
            <a
              href="https://www.tiktok.com/@itsjovanaar"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/assets/tiktok.png"
                alt="TikTok"
                className="social-icon"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
