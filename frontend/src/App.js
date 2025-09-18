import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Footer from './components/Footer/Footer';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DatabaseViewer from './components/DatabaseViewer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="profile-container">
                  <h2>Profile Page</h2>
                  <p>This is a protected route. Only authenticated users can see this.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div className="dashboard-container">
                  <h2>Dashboard</h2>
                  <p>Welcome to your fitness dashboard. Track your progress here.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/database" element={
              <ProtectedRoute>
                <DatabaseViewer />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
