import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Correct import
import LoginSignUp from './LoginSignUp/LoginSignUp';
import Membership from './Membership/Membership';
import Home from './Home/Home';
import ProfilePage from './ProfilePage/ProfilePage';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import PrivateRoute from './PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/signup" element={<LoginSignUp key={Date.now()} />} />
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="/membership-tiers" element={<Membership />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/membership-tiers/:id" element={<Membership />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}



export default App;
