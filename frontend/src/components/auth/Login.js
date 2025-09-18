import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState('');
  const { login, sendOTP, verifyOTP, otpSent, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!phoneNumber || phoneNumber.length < 10) {
      setFormError('Please enter a valid phone number');
      return;
    }
    
    try {
      // First log the user in to store the phone number
      await login(phoneNumber);
      // Then send OTP
      await sendOTP(phoneNumber);
    } catch (err) {
      setFormError(err.message || 'Failed to send OTP. Please try again.');
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
        <h2>Login</h2>
        {(formError || error) && <div className="auth-error">{formError || error}</div>}
        
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="auth-form">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div id="recaptcha-container" className="recaptcha-container"></div>
            
            <button type="submit" className="auth-button">Send OTP</button>
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
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;