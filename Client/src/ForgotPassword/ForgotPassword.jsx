import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/forgot-password', { email });
            toast.success(`Aniverse says: ${response.data.message}`);
        } catch (error) {
            console.error(error);
            toast.error(
                `Aniverse says: ${error.response?.data?.message || 'Error sending recovery email.'}`
            );
        }
    };

    return (
        <div className="forgot-password-page">
            <form className="forgot-password-form" onSubmit={handleSubmit}>
                <h1>Forgot Password</h1>
                <p>Enter your email to reset your password.</p>
                <div className="inputFP">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submitFP">Send Reset Link</button>
                <ToastContainer
                    position="top-right" // Specify the position
                    autoClose={5000} // Optional: Time before toast disappears (ms)
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </form>
        </div>
    );
};

export default ForgotPassword;
