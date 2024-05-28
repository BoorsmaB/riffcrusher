import React from "react";
import "./AboutMe.css";

function AboutMe() {
  return (
    <div className="aboutme-container">
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
            from the Blackened-Death metal band "Onheil". I've started this
            website because I wanted to combine my passion for creating metal
            music, content creation and all my other hobbies.{" "}
          </p>
          <p>
            I wanted a space where I could do whatever I want and since
            finishing my Front-End Developing studies I've got the tools to do
            this myself as well.
          </p>{" "}
          <p>
            Keep an eye on this space, because I'm interested in creating a
            community-driven platform bringing everyone together who enjoys loud
            music, scary movies, and video games.
          </p>
          <a href="https://www.twitch.tv/ItsJovanaar">
            https://www.twitch.tv/ItsJovanaar
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
