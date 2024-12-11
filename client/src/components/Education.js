import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './webpage.css';

function Education() {
  const [education, setEducation] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/getEdu")
      .then((response) => setEducation(response.data[0])) // Assuming first item in the array
      .catch((error) => console.error("Error fetching Education data", error));
  }, []);

  return (
    <div className="experience-container">
      <h2>Education</h2>
      {education ? (
        <>
          <p>School: {education.school}</p>
          <p>Degree: {education.degree}</p>
          <p>Graduation Year: {education.grad}</p>
        </>
      ) : (
        <p>Loading education data...</p>
      )}
      <Link to="/" className="home-button">Home</Link>
    </div>
  );
}

export default Education;
