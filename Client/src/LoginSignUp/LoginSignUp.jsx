import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoginSignUp.css';
import user_icon from '../assets/user.png';
import email_icon from '../assets/mail.png';
import password_icon from '../assets/padlock.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    // Reset form fields when the component is loaded
    useEffect(() => {
        if (window.location.pathname === '/login-signup') {
            setName('');
            setEmail('');
            setPassword('');
            setMessage('');
            setIsLogin(false); 
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin
            ? 'http://localhost:4000/login'
            : 'http://localhost:4000/signup';
    
        try {
            const response = await axios.post(
                endpoint,
                isLogin ? { email, password } : { name, email, password }
            );
    
            toast.success(`Aniverse says: ${response.data.message}`);
    
            const { token } = response.data; 
            
            if (token) {
                localStorage.setItem('authToken', token); 
                console.log('Token after submission:', localStorage.getItem('authToken'));
                navigate('/profile'); 
            } else {
                console.error('No token in response');
                if (!isLogin) {
                    navigate('/login');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(
                `Aniverse says: ${error.response?.data?.message || 'An error has occurred.'}`
            );
        }
    };
    
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <form className="login-signup-page" onSubmit={handleSubmit} autoComplete="off">
            <div className="container">
                <div className="header">
                    <div className="text">{isLogin ? 'Login' : 'Sign Up'}</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    {!isLogin && (
                        <div className="input">
                            <img src={user_icon} alt="User Icon" />
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="off"
                                required
                            />
                        </div>
                    )}
                    <div className="input">
                        <img src={email_icon} alt="Email Icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="Password Icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="forgot-password">
                    {isLogin && (
                        <>
                            Forgot Password?{' '}
                            <span
                                onClick={() => navigate('/forgot-password')}
                                style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Click Here!
                            </span>
                        </>
                    )}
                </div>
                <div className="submit-container">
                    <button type="submit" className="submit">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                    <button
                        type="button"
                        className="submit"
                        onClick={toggleMode}
                    >
                        Switch to {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>

                {message && <p className="message">{message}</p>}
                <ToastContainer />
            </div>
        </form>
    );
};

export default LoginSignUp;
