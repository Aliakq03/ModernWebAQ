import React, { useEffect, useState } from 'react';
import './Membership.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Membership = () => {
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/membership-tiers');
        setTiers(response.data);
        setLoading(false); // Stop loading once tiers are fetched
      } catch (error) {
        console.error('Error fetching tiers:', error);
        setLoading(false); // Stop loading on error
      }
    };
    fetchTiers();
  }, []);

  // Fetch the user's profile to check current membership
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:4000/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSelectedTier(response.data.membershipLevel || 'Basic');
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleChooseTier = async (tierName) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast('Please log in to select a membership');
        return;
      }

      const response = await axios.post(
        'http://localhost:4000/select-membership',
        { tier: tierName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedTier(tierName); // Update the selected tier in the frontend
      toast.success(response.data.message); // Display success message
    } catch (error) {
      console.error('Error selecting membership:', error);
      toast.error('Error selecting membership');
    }
  };

  if (loading) {
    return <p>Loading membership tiers...</p>;
  }

  return (
    <div className="membership-page">
      <div className="membership-container">
        <h1 className="membership-title">Choose Your Membership</h1>
        <div className="tiers">
          {tiers.map((tier, index) => (
            <div className={`tier ${tier.name.toLowerCase()}`} key={index}>
              <h2>{tier.name}</h2>
              <p className="price">{tier.price}</p>
              <div className="desc">{tier.desc}</div>
              <button
                className="choose-btn"
                onClick={() => handleChooseTier(tier.name)}
              >
                Choose {tier.name}
              </button>
              {selectedTier === tier.name && (
                <p className="selected">You selected: {tier.name} Membership</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Membership;
