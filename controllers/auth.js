const pool = require('../db.js');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user exists
    const [existingUser] = await pool.query(
      'SELECT id FROM login WHERE email = ? OR username = ?', 
      [email, username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email or username already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO login (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.insertId }, 
       'jwtkey', 
      { expiresIn: '1h' }
    );
console.log(result)
    res.status(200).json({ 
      success: true,
      token,
      user: {
        id: result.insertId,
        username,
        email
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

const login = async (req, res) => {
  try {
    console.log("login")
    const { username, password } = req.body;
    console.log(username, password)
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check user exists
    const [data] = await pool.query(
      'SELECT * FROM login WHERE username = ?',
      [username]
    );

    if (data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, data[0].password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    // Create token
    const token = jwt.sign(
      { id: data[0].id }, 'jwtkey', {expiresIn: "1h"}
    );

    // Remove password from user data
    const { Password, ...userData } = data[0];
     userData.token = token;
        // console.log(data[0],"data")
    // console.log(userData,"users")
//     .cookie("access_token", token, {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production', 
//   sameSite: 'strict',
//   maxAge: 3600000 // 1 hour
// })
// console.log()
res.cookie("access_token", token, {
  httpOnly: true,
}).status(200).json(userData);
    console.log(token);
    

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

const logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }).status(200).json({ message: 'Successfully logged out' });
};

module.exports = 
 { register,
  login,
  logout}
 