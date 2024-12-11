import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';
import userIcon from '../assets/user.png'; // Import a user icon image
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    membershipLevel: 'Basic',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's profile data from the API
    axios
      .get('http://localhost:4000/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setFormData({ name: response.data.name, email: response.data.email });
      })
      .catch((error) => {
        setError('Failed to load profile. Please log in again.');
        console.error('Error fetching user profile:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = () => {
    axios
      .put(
        'http://localhost:4000/profile',
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      )
      .then((response) => {
        setUser(response.data.updatedUser);
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
      })
      .catch((error) => {
        setError('Error updating profile. Please try again.');
        console.error('Error updating profile:', error);
      });
  };
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  const handleSignOut = () => {
    // Clear authentication tokens and redirect to login
    localStorage.removeItem('authToken');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <img src={userIcon} alt="User Icon" className="profile-icon" />
          <h2>Welcome, {user.name || 'User'}!</h2>
        </div>

        <h2>User Profile</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {!isEditing ? (
          <div className="profile-info">
            <div className="profile-item">
              <label>Name:</label>
              <span>{user.name}</span>
            </div>
            <div className="profile-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="profile-item">
              <label>Membership Level:</label>
              <span>{user.membershipLevel}</span>
            </div>
            <div className="profile-actions">
              <button
                className="edit-profile-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button className="sign-out-button" onClick={handleSignOut}>
                Sign Out
              </button>
              <button onClick={() => navigate('/')}>Home</button>
            </div>
          </div>
        ) : (
          <div className="profile-edit-form">
            <div className="profile-item">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="profile-item">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="profile-actions">
              <button className="update-profile-button" onClick={handleUpdateProfile}>
                Save Changes
              </button>
              <button
                className="cancel-edit-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
