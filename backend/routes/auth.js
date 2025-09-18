const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'venky',
  database: process.env.DB_NAME || 'fitbody',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database
const initDb = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uid VARCHAR(128) UNIQUE NOT NULL,
        name VARCHAR(100),
        email VARCHAR(100),
        phone_number VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Initialize database on startup
initDb();

// Save user to database
router.post('/save-user', async (req, res) => {
  try {
    const { uid, phoneNumber, name, email } = req.body;
    
    if (!uid || !phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'UID and phone number are required' 
      });
    }
    
    const connection = await pool.getConnection();
    
    // Check if user already exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE uid = ?', 
      [uid]
    );
    
    if (existingUsers.length > 0) {
      // Update existing user
      await connection.query(
        'UPDATE users SET name = ?, email = ?, phone_number = ? WHERE uid = ?',
        [name, email, phoneNumber, uid]
      );
    } else {
      // Insert new user
      await connection.query(
        'INSERT INTO users (uid, name, email, phone_number) VALUES (?, ?, ?, ?)',
        [uid, name, email, phoneNumber]
      );
    }
    
    connection.release();
    
    res.status(200).json({ 
      success: true, 
      message: 'User saved to database successfully' 
    });
  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save user to database',
      error: error.message
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT * FROM users');
    connection.release();
    
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Get user profile
router.get('/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT * FROM users WHERE uid = ?',
      [uid]
    );
    connection.release();
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user data',
      error: error.message
    });
  }
});

module.exports = router;