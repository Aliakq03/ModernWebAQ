import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './webpage.css';

function Experience() {
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/getExp") // Corrected endpoint
      .then((response) => setExperience(response.data))
      .catch((error) => console.error("Error fetching experience data", error));
  }, []);

  return (
    <div className="experience-container">
      <h2>Experience</h2>
      {experience.length > 0 ? (
        experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <p><strong>Company:</strong> {exp.company}&nbsp; <strong>Role:</strong> {exp.role}&nbsp; <strong>Duration:</strong> {exp.duration}</p>
          </div>
        ))
      ) : (
        <p>Loading experience data...</p>
      )}
      <Link to="/" className="home-button">Home</Link>
    </div>
  );
}

export default Experience;
