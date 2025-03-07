//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine' , 'ejs');

// *********setup mongoose***********

mongoose.connect("mongodb://localhost:27017/secretsDB" , { useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']});

const User = mongoose.model("User" , userSchema);

// **************************************

app.get("/" , function(req,res){
  res.render("home");
});

// *********

app.get("/login" , function(req,res){
  res.render("login");
});

app.post("/login" , function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email : username} , function(err , foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }else{
          res.send("Password entered is not valid.");
        }
      }else{
        res.send("no such user exists.");
      }
    }
  });
});

// *******

app.get("/register" , function(req,res){
  res.render("register");
});

app.post("/register" , function(req,res){
  const newUser = new User({
    email:req.body.username ,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});


app.listen("3000" , function(req,res){
  console.log("server started at port 3000");
});
