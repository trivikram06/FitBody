import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { authAPI } from '../services/api';

// Create the Auth Context
export const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // If user is logged in, get user details from localStorage
      if (user) {
        const storedUserDetails = localStorage.getItem('userDetails');
        if (storedUserDetails) {
          setUserDetails(JSON.parse(storedUserDetails));
        }
      }
    });

    return unsubscribe;
  }, []);

  // Set up reCAPTCHA verifier
  const setupRecaptcha = (phoneNumber) => {
    try {
      // Clear existing recaptcha if it exists
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.error('Error clearing existing reCAPTCHA:', e);
        }
        delete window.recaptchaVerifier;
      }
      
      // Make sure the container exists
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        console.error('reCAPTCHA container not found');
        throw new Error('reCAPTCHA container not found. Please refresh the page and try again.');
      }
      
      // Create a new instance with the correct container ID
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          setError('reCAPTCHA expired. Please try again.');
        }
      });
      
      // Render the reCAPTCHA widget
      return window.recaptchaVerifier;
    } catch (error) {
      console.error('reCAPTCHA setup error:', error);
      setError('Failed to set up verification. Please try again.');
      throw error;
    }
  };

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      setUserDetails(userData);
      
      // Store user details for later use after OTP verification
      localStorage.setItem('userDetails', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user with phone number
  const login = async (phoneNumber) => {
    try {
      setLoading(true);
      setError(null);
      
      // Store phone number for later use
      localStorage.setItem('phoneNumber', phoneNumber);
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userDetails');
      localStorage.removeItem('phoneNumber');
      setUserDetails(null);
      setCurrentUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // Send OTP
  const sendOTP = async (phoneNumber) => {
    try {
      setLoading(true);
      setError(null);
      
      // Format phone number to E.164 format (ensure it has country code)
      let formattedPhoneNumber = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        // If no country code, assume +91 (India) or change as needed
        formattedPhoneNumber = `+91${phoneNumber}`;
      }
      
      console.log('Sending OTP to:', formattedPhoneNumber);
      
      // Set up reCAPTCHA verifier
      const recaptchaVerifier = setupRecaptcha(formattedPhoneNumber);
      
      // Send OTP
      const confirmation = await signInWithPhoneNumber(
        auth, 
        formattedPhoneNumber, 
        recaptchaVerifier
      );
      
      setConfirmationResult(confirmation);
      setOtpSent(true);
      
      return { success: true };
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send OTP');
      
      // Reset recaptcha on error
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          delete window.recaptchaVerifier;
        } catch (clearError) {
          console.error('Error clearing reCAPTCHA:', clearError);
        }
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (otp) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!confirmationResult) {
        throw new Error('No OTP was sent. Please request OTP first.');
      }
      
      // Verify OTP
      const result = await confirmationResult.confirm(otp);
      
      // User is now signed in
      setCurrentUser(result.user);
      setOtpSent(false);
      
      // Save user data to MySQL database via API
      if (userDetails) {
        try {
          // Make an API call to save user data to MySQL
          const response = await fetch('http://localhost:5000/api/auth/save-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: result.user.uid,
              phoneNumber: result.user.phoneNumber,
              ...userDetails
            }),
          });
          
          if (!response.ok) {
            console.error('Server response:', await response.text());
            throw new Error('Failed to save user data');
          }
          
          const data = await response.json();
          console.log('User data saved to MySQL successfully:', data);
        } catch (dbError) {
          console.error('Failed to save user data to database:', dbError);
          // Continue with authentication even if database save fails
        }
      }
      
      // Clean up recaptcha after successful verification
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          delete window.recaptchaVerifier;
        } catch (clearError) {
          console.error('Error clearing reCAPTCHA:', clearError);
        }
      }
      
      return { success: true, user: result.user };
    } catch (err) {
      console.error('OTP verification error:', err);
      
      // Reset OTP state on verification failure
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP code. Please try again.');
      } else if (err.code === 'auth/code-expired') {
        setError('OTP code has expired. Please request a new one.');
        setOtpSent(false);
      } else {
        setError(err.message || 'Invalid OTP');
      }
      
      // Clean up recaptcha on error
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          delete window.recaptchaVerifier;
        } catch (clearError) {
          console.error('Error clearing reCAPTCHA:', clearError);
        }
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    currentUser,
    userDetails,
    loading,
    error,
    otpSent,
    register,
    login,
    logout,
    sendOTP,
    verifyOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};