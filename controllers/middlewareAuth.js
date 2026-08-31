const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const verifyTokenCookie = async (req, res, next) => {
  console.log("Middleware called for:", req.path); // Debug log
  const token = req.cookies.access_token;
  console.log("Token present:", !!token); // Debug log
  
  if (!token) {
    console.log("No token found"); // Debug log
    return next();
  }

  try {
    const decoded = jwt.verify(token, 'jwtkey');
    req.user = decoded;
    console.log("User set in middleware:", req.user); // Debug log
    next();
  } catch (e) {
    console.log("Token verification failed:", e.message); // Debug log
    return res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = {
  verifyTokenCookie
}