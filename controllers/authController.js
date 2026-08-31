const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    const user = await User.create({
      username,
      email,
      password
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
