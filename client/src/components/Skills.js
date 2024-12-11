import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './webpage.css';

function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/getSkills")
      .then((response) => setSkills(response.data)) // No .skills here since data is directly an array
      .catch((error) => console.error("Error fetching skills data", error));
  }, []);

  return (
    <div className="skill-container">
      <h2>Skills</h2>
      {skills.length > 0 ? (
        <ul>
          {skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      ) : (
        <p>Loading Skills Data...</p>
      )}
      <Link to="/" className="home-button">Home</Link>
    </div>
  );
}

export default Skills;
