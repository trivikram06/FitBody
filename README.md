# FitBody Application

A fitness application with Firebase OTP authentication.

## Project Structure

The project is organized into frontend and backend directories:

### Frontend (React)
- Located in the `frontend/` directory
- React application with Firebase authentication
- Uses context API for state management

### Backend (Express)
- Located in the `backend/` directory
- Express.js REST API
- Firebase Admin SDK for authentication verification

## Setup Instructions

### Frontend Setup
```
cd frontend
npm install
npm start
```

### Backend Setup
```
cd backend
npm install
npm start
```

## API Endpoints

- `POST /api/auth/verify-otp` - Verify OTP code
- `GET /api/auth/user/:uid` - Get user profile