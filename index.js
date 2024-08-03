const mysql=require("mysql")
const express =require("express")
const db = require("./database.js")
const cookieParse=require("cookie-parser")
const jwt = require("jsonwebtoken")
const { render } = require("ejs")

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.message);
        return;
    }
    console.log('Connected to the database');
});

const isAuthenticated=async(req,res,next)=>{
    const {token}=req.cookies;

  if(token){
    try{
        const decoded=jwt.verify(token,"Hamza@182")
    const userData= await getUserData(decoded);

    if(userData){
        req.user=userData;
        next()
    }
    else{
        res.render("login.ejs");
    }
    }
    catch (err){
        res.render("login.ejs");
    }
    
   
    
   
  }
  else{
    res.render("login.ejs")  
  }
}
const getUserData = (email) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data[0]); // Assuming you expect one result
          }
        }
      );
    });
  };



const app =express()
app.use(express.urlencoded({extended: true}))
app.use(cookieParse())
//get /


app.get("/",isAuthenticated,(req,res)=>{
   
    res.render("logout.ejs",{name:req.user.name})
})




app.post("/login",async(req , res)=>{

     const user =await getUserData(req.body.email)
  if(!user){
    return res.render("register.ejs")
  }
  let email=req.body.email
  let eemail= jwt.sign(email,"Hamza@182")
 
    if(req.body.password==jwt.verify(user.password,"Hamza@182")){
      res.cookie("token",eemail,{httpOnly:true, expires :new Date(Date.now()+60*1000)})
      res.redirect("/")
    }
 
    
  
})


app.get("/logout",(req , res)=>{
    res.cookie("token",null,{httpOnly:true,expires:new Date(Date.now())})
    res.redirect("/")
})


//get /register
app.get("/register",(req,res)=>{
    res.render("register.ejs")
})


//post register
app.post("/register",(req,res)=>{
   console.log(req.body)
   let name=req.body.name
let email=req.body.email
let pass=req.body.password
let epass=jwt.sign(pass,"Hamza@182")

let addqry = 'INSERT INTO users (name, email,password) VALUES (?, ?,?)';
db.query(addqry, [name, email,epass], (err, data) => {
 if(err){
   console.log("error while saving data"+err.message)

 }else{
    console.log("1 row inserted")
 }
 res.render("login.ejs")
});
})




app.listen("8081",(req,res)=>{
    console.log("server running")
})