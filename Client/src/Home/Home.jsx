import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Welcome to my home page</h1>
            <p>This is my home page! Please modify!</p>
            <button onClick={() => navigate('/login')}>Go to Login/Signup</button>
            <br></br>
            <button onClick={() => navigate('/profile')}>Go to Profile</button>
            <br></br>
            <button onClick={() => navigate('/membership-tiers')}>Go to Memberships</button>
        </div>
    );
}
export default Home;