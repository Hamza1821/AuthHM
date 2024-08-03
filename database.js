const express =require("express")
const mysql= require("mysql")

 const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Hamza@182",
    database:"profile"
   
})
module.exports=db;