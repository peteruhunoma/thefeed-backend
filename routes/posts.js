const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require('../db.js');
const getPosts = require("../controllers/post.js");
const {verifyTokenCookie} = require("../controllers/middlewareAuth.js");
const router = express.Router();


router.use(verifyTokenCookie);
router.get('/', getPosts.getPosts);
router.get('/:id', getPosts.getPost);
router.post('/', getPosts.addPost);
router.delete("/:id/:uid", getPosts.deletePost);
router.put('/:edit/:uid', getPosts.updatePost);
module.exports = router;