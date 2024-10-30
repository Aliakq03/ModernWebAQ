// Import React and CSS
import React from 'react';
import { Link } from 'react-router-dom';
import './webpage.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Bob Ross's Portfolio</h1>
      <p className="home-description">
        Explore the life and work of Bob Ross, the painter and art mentor.
      </p>

      <div className="nav-links">
        <Link to="/overview" className="nav-button">Overview</Link>
        <Link to="/experience" className="nav-button">Experience</Link>
        <Link to="/education" className="nav-button">Education</Link>
        <Link to="/skills" className="nav-button">Skills</Link>
      </div>
    </div>
  );
}

export default Home;
