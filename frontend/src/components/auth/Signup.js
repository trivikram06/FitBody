import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Auth.css';

const Signup = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState('');
  const { register, sendOTP, verifyOTP, otpSent, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!userData.phoneNumber || userData.phoneNumber.length < 10) {
      setFormError('Please enter a valid phone number');
      return;
    }
    
    try {
      // Register user data first
      await register(userData);
      // Then send OTP
      await sendOTP(userData.phoneNumber);
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!otp || otp.length < 6) {
      setFormError('Please enter a valid OTP');
      return;
    }
    
    try {
      await verifyOTP(otp);
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Sign Up</h2>
        {(formError || error) && <div className="auth-error">{formError || error}</div>}
        
        {!otpSent ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div id="recaptcha-container" className="recaptcha-container"></div>
            
            <button type="submit" className="auth-button">Register & Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter the 6-digit OTP"
                required
              />
            </div>
            
            <button type="submit" className="auth-button">Verify OTP</button>
          </form>
        )}
        
        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;