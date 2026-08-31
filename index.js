require('dotenv').config();
const express = require('express');
const cors =require('cors');
const jwt = require('jsonwebtoken');
const session = require("express-session");
const  bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require("fs");
const multiparty = require('multiparty');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;
const pool = require('./db.js');



// Middleware
app.use(express.json());
app.use(cors({origin: 'http://localhost:5173', 
credentials: true}));
app.use(cookieParser())

app.use(session({
  secret: "pwtkey", // change to a strong secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));

pool.getConnection()
  .then(conn => {
    console.log('Connected to database');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

  

  app.post('/uploads', (req, res) => {
    const form = new multiparty.Form({
      uploadDir: path.join(__dirname, '../blog-frontend/my-react-app/public/uploads'),
    });
  
    form.parse(req, (err, fields, files) => {
      if (err) return res.status(500).send('Upload error');
  
      const uploadedFile = files.file?.[0]; // assuming <input name="file" />
  
      if (!uploadedFile) {
        return res.status(400).send("No file uploaded");
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!allowedTypes.includes(uploadedFile.headers['content-type'])) {
        // Remove the unwanted file
        fs.unlinkSync(uploadedFile.path);
        return res.status(400).send('Only JPG, JPEG, and PNG files are allowed');
      }

      const newFilename = path.basename(uploadedFile.path);
  
      res.send(newFilename); // ⬅️ return just the filename as a string
    });
  });
  
  

app.use('/api/auth',  require('./routes/auth.js'));
app.use('/posts',  require('./routes/posts.js'));

app.post("/badstatus", (req, res)=>{
res.status(200).send("badstatus");
});
// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});