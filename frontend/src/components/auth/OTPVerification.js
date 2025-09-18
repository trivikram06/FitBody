import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Auth.css';

const OTPVerification = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState('');
  const { sendOTP, verifyOTP, otpSent, userExists, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      await sendOTP(mobileNumber);
    } catch (err) {
      setFormError(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      const response = await verifyOTP(mobileNumber, otp);
      if (response.success) {
        navigate(userExists ? '/login' : '/signup');
      }
    } catch (err) {
      setFormError(err.message || 'OTP verification failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>OTP Verification</h2>
        {(formError || error) && <div className="auth-error">{formError || error}</div>}
        
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="auth-form">
            <div className="form-group">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="tel"
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="auth-button">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="auth-button">Verify OTP</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;