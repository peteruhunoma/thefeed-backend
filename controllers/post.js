const jwt = require("jsonwebtoken");
const pool = require('../db.js');
require('dotenv').config();

const getPosts = async (req, res) =>{
 const q = req.query.cats ? "SELECT * FROM posts WHERE cats=?" : "SELECT * FROM posts";

console.log("hello world");
    try{

        let [data] = await pool.query(q, [req.query.cats])
           res.status(200).json(data);
        console.log(data)
    } catch(err){
        console.log(err);
        res.status(404).json(err);
    }
}

const getPost = async (req, res) =>{
    const q= "SELECT p.id, `username`, `cats`, `title`, `descs`, `userImage`, `uid`,  p.img, `cats`, `date` FROM login l JOIN posts p ON l.id = p.uid WHERE p.id =?"
try{
    let [data] = await pool.query(q, [req.params.id])
    res.status(200).json(data)
}catch(err){
    res.status(400).json(err);
    console.log(err);
}
    
}

const addPost = async (req, res) => {

    try{
        const loggedInUser = req.user?.id;
        const id = req.query.id;
        const q1 = "SELECT id FROM login WHERE id = ?";
        const [rows] = await pool.query(q1, [id]);
        
        if (!loggedInUser) {
            return res.status(401).json("You are not logged in");
          }
        
        if (rows.length === 0) {
            return res.status(404).json("user not found");
          }

          const pathid = rows[0].id;

  
  console.log(pathid); 
  const q = "INSERT INTO posts(`title`, `descs`, `img`, `cats`, `date`, `uid`) VALUES (?)";

const values = [
    req.body.title,
    req.body.descs,
    req.body.img,
    req.body.cats,
    req.body.date,
    pathid,
]
let [data] = await pool.query(q, [values]);

    res.status(200).json(data)


console.log(data)

    }catch(err){
        console.log(err, "did not work")
    }


}
const deletePost = async (req, res) =>{

       try {

        const loggedInUser = req.user?.id;
        const postId = req.params.id;
        const uid = req.params.uid;
        const q = " DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

        if (!loggedInUser) {
            return res.status(401).json("You are not logged in");
          }


        let [data] = await pool.query(q,[postId, uid]);
         
        
            
            console.log(uid, "uidd");
            // console.log(data);
            res.status(200).json(data);
        
    }catch(err){

        res.status(403).json(err);
        console.log(err);

    }
    
}

const updatePost = async (req, res) =>{
    try{
        const loggedInUser = req.user?.id;
        const id = req.params.id;
        const uid = req.params.uid;
        const q1 = "SELECT id FROM login WHERE id = ?";
        const [rows] = await pool.query(q1, [uid]);
        
        if (!loggedInUser) {
            return res.status(401).json("You are not logged in");
          }
          
        if (rows.length === 0) {
            return res.status(400).json("User not found");
          }

          const uids = rows[0].id;

  const edit = req.params.edit; 
  const q = `UPDATE posts AS p JOIN login AS l ON p.uid = l.id SET p.title = ?, p.descs = ?, p.img = ?, p.cats = ? WHERE p.id = ? AND p.uid = ? `;
const values = [
    req.body.title,
    req.body.descs,
    req.body.img,
    req.body.cats,
    edit,
    uids

]
let [data] = await pool.query(q, values);

    res.status(200).json(data)

console.log(edit, "just checkind");
console.log(uids, 'uid check');
console.log(values, "values check")
console.log(data)

    }catch(err){
        console.log(err, "did not work")
    }

    
}

module.exports = 
 { getPosts,
  getPost,
  addPost,
deletePost,
updatePost}