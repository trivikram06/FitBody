import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaArrowRight, FaBrain, FaLightbulb } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import './Hero.css';

const Hero = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [showAuthMessage, setShowAuthMessage] = useState(false);

  const handleInteraction = () => {
    if (!isAuthenticated) {
      setShowAuthMessage(true);
    }
  };

  const handleAICreation = () => {
    // AI Creation logic will be implemented here
    console.log("AI Creation button clicked");
    if (!isAuthenticated) {
      setShowAuthMessage(true);
    }
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-image-section">
          <div className="image-grid">
            <div className="vertical-images">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                alt="Person in fitness attire" 
                className="vertical-image top"
              />
              <img 
                src="https://images.unsplash.com/photo-1575908539614-ff89490f4a78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                alt="Digital fitness interface" 
                className="vertical-image bottom"
              />
            </div>
            <img 
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Group fitness class" 
              className="horizontal-image"
            />
          </div>
          <div className="agent-ai-logo">
            <FaRobot className="ai-icon" />
          </div>
        </div>
        <div className="hero-content-section">
          <h1 className="hero-title">Transform Your Fitness Journey with AI</h1>
          <p className="hero-description">
            Experience personalized workout plans, nutrition guidance, and real-time feedback powered by cutting-edge artificial intelligence.
          </p>
          {showAuthMessage && !isAuthenticated && (
            <div className="auth-message">
              <p>Please sign in to continue</p>
              <div className="button-group">
                <Link to="/login" className="auth-btn">Sign In</Link>
                <Link to="/register" className="auth-btn">Register</Link>
              </div>
            </div>
          )}
          {!showAuthMessage && (
            <div className="button-group">
              <button className="continue-btn" onClick={handleInteraction}>
                Continue to Next <FaArrowRight className="arrow" />
              </button>
              <button className="ai-creation-btn" onClick={handleAICreation}>
                AI Creation <FaBrain className="brain-icon" /> <FaLightbulb className="light-icon" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;