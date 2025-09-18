// API service for communicating with the backend

const API_URL = 'http://localhost:5000/api';

// Authentication API calls
export const authAPI = {
  // Verify OTP
  verifyOTP: async (sessionInfo, code) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionInfo, code }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, message: 'Failed to verify OTP' };
    }
  },
  
  // Get user profile
  getUserProfile: async (uid) => {
    try {
      const response = await fetch(`${API_URL}/auth/user/${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { success: false, message: 'Failed to fetch user profile' };
    }
  }
};

export default {
  auth: authAPI
};