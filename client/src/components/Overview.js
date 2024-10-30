import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './webpage.css'; // Importing the CSS file

function Overview() {
  const [overview, setOverview] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8000/api/getOverview")
      .then((response) => setOverview(response.data))
      .catch((error) => console.error("Error fetching overview data", error));
  }, []);

  return (
    <div className="overview-container">
      <h2>Overview</h2>
      <p>
        {overview.name} <br></br>
        {overview.title}<br></br>
        {overview.description}
      </p>
      <Link to="/" className="home-button">Home</Link> {/* Home button */}
    </div>
  );
}

export default Overview;
