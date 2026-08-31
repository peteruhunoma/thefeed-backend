const db = require('../config/db');
const bcrypt = require('bcryptjs');

const validator = require('validator');

class User {
  static async create({ username, email, password }) {
    // Validate input
    if (!username || !email || !password) {
       console.log('All fields are required');
    }
    
    if (!validator.isEmail(email)) {
       console.log('Invalid email format');
    }
    
    if (password.length < 6) {
       console.log('Password must be at least 6 characters');
    }
    
    // Check if user exists
    const [existing] = await db.query(
      'SELECT id FROM login WHERE email = ?', 
      [email]
    );
    
    if (existing.length > 0) {
       console('Email already in use');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const [result] = await db.query(
      'INSERT INTO login (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    return { id: result.insertId, username, email };
  }

  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM login WHERE email = ?',
      [email]
    );
    return rows[0];
  }
}

module.exports = User;