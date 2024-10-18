import React, { useState } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [fetchedSingleFile, setFetchedSingleFile] = useState(null);
  const [dogImage, setDogImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Handle file input for single upload
  const handleSingleFileChange = (e) => {
    setSingleFile(e.target.files[0]);
  };

  // Handle file input for multiple uploads
  const handleMultipleFilesChange = (e) => {
    setMultipleFiles(e.target.files);
  };

  // Upload a single file to the server
  const uploadSingleFile = async () => {
    const formData = new FormData();
    formData.append('file', singleFile);

    try {
      const response = await fetch('http://localhost:8000/save/single', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error uploading single file:', error);
    }
  };

  // Upload multiple files to the server
  const uploadMultipleFiles = async () => {
    const formData = new FormData();
    for (let i = 0; i < multipleFiles.length; i++) {
      formData.append('files', multipleFiles[i]);
    }

    try {
      const response = await fetch('http://localhost:8000/save/multiple', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
    }
  };

  // Fetch a random single file from the server
  const fetchSingleFile = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetch/single');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setFetchedSingleFile(url);
    } catch (error) {
      console.error('Error fetching single file:', error);
    }
  };

  // Fetch random dog image
  const getRandomDogImage = async () => {
    try {
      const response = await axios.get("http://localhost:8000/dog/random");
      setDogImage(response.data.message);
      // Convert the image URL to a Blob and create a file object
      const imageResponse = await fetch(response.data.message);
      const blob = await imageResponse.blob();
      const file = new File([blob], 'dog.jpg', { type: 'image/jpeg' });
      setImageFile(file);
    } catch (error) {
      console.error("Error fetching dog image:", error);
    }
  };
   
  const uploadImage = async () => {
    if (!imageFile) {
      alert("No image to upload");
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData);
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const fetchMultipleFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetch/multiple');
      const data = await response.json();
      
      // Clear the previous images
      document.getElementById('multipleFilesContainer').innerHTML = '';

      if (data.files) {
        data.files.forEach(fileUrl => {
          const img = document.createElement('img');
          img.src = fileUrl;
          img.style.width = '200px'; // Adjust size as needed
          img.style.marginTop = '10px';
          document.getElementById('multipleFilesContainer').appendChild(img);
        });
      } else {
        alert("No files found!");
      }
    } catch (error) {
      console.error('Error fetching multiple files:', error);
    }
  };

  return (
    <div className="file-upload-app">
  <h1>File Upload and Fetch App</h1>

  {/* Section for uploading single file */}
  <section className="upload-section">
    <h2>Upload Single File</h2>
    <input type="file" onChange={handleSingleFileChange} />
    <button className="btn-primary" onClick={uploadSingleFile}>Upload Single File</button>
  </section>

  {/* Section for uploading multiple files */}
  <section className="upload-section">
    <h2>Upload Multiple Files</h2>
    <input type="file" multiple onChange={handleMultipleFilesChange} />
    <button className="btn-primary" onClick={uploadMultipleFiles}>Upload Multiple Files</button>
  </section>

  {/* Section for fetching multiple files */}
  <section className="fetch-section">
    <h2>Fetch Multiple Files</h2>
    <button className="btn-primary" onClick={fetchMultipleFiles}>Fetch Multiple Files</button>
    <div id="multipleFilesContainer" className="files-container"></div>
  </section>

  {/* Section for fetching and displaying a single file */}
  <section className="fetch-section">
    <h2>Fetch Single File</h2>
    <button className="btn-primary" onClick={fetchSingleFile}>Fetch Single File</button>
    {fetchedSingleFile && (
      <article className="file-display">
        <h3>Single File</h3>
        <img src={fetchedSingleFile} alt="Fetched Single" />
      </article>
    )}
  </section>

  {/* Section for fetching random dog image */}
  <section className="random-dog-section">
    <h2>Random Dog Image Fetcher and Uploader</h2>
    <button className="btn-primary" onClick={getRandomDogImage}>Get Random Dog Image</button>
    {dogImage && (
      <article className="file-display">
        <h3>Random Dog Image:</h3>
        <img src={dogImage} alt="Random Dog" />
        <div>
          <button className="btn-secondary" onClick={uploadImage}>Upload Dog Image</button>
        </div>
      </article>
    )}
  </section>
</div>
  );
}

export default App;
