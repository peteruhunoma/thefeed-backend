const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const pool = require('../db.js');
const register =require('../controllers/auth.js');
// const login =require('../controllers/auth.js');
// const logout =require('../controllers/auth.js');
const  bcrypt = require('bcryptjs');


router.post("/register", register.register);
router.post("/login", register.login);
router.post("/logout", register.logout);

module.exports = router;