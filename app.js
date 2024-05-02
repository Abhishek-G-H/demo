// require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const pg = require("pg")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const {Strategy} = require("passport-local")

const app = express();
const db =new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "admin",
    password: "123456",
    port: 5423,

});
db.connect();
const Employee = require('./models/employee');

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: "Secure", // Environment variable
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get("/", function(req, res){
    res.render("login");
});


app.post("/login", function(req, res){

    const email = req.body.username;
    const password = req.body.password;
    if(req.isAuthenticated()){
        res.render("dashboard");
    }else{
        res.render("login")
    }

});
app.post("/login", passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect: "/login",
}))

passport.use(new Strategy(async function verify(username,password,cb){
    try{
        const result = await db.qurey("SELECT * FROM user WHERE email = $1",[username]);
        const condition =result.row.length;
        if(condition>1){
            const user = result.row[0];
            const storedPassword = result.password;
            if(password===storedPassword){
                return cb(null,user)
            }else{
                return cb(null,false)
            }
        }
        else{
            return cb("User not found");
        }
    }catch(err){
        cb(err);
    }

}))

passport.serializeUser((user,cb)=>{
    cb(null,user);
})
passport.deserializeUser((user,cb)=>{
    cb(null,user);
})

app.get("/createEmployee",function(req,res){
    if(req.isAuthenticated()){
        res.render("Create_Employee");
    }else{
        res.render("login")
    }
})

app.get("/employee-list", function(req, res) {
    if(req.isAuthenticated()){
        Employee.find({}, function(err, employees) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err });
        } else {
            res.render("employee-list", { employees: employees });
        }
    });
    }else{
        res.render("login")
    }
});

app.get("/employee_edit",function(req,res){
    if(req.isAuthenticated()){
        res.render("Employee_Edit")
    }else{
        res.render("login")
    }
})

app.get("logout",function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})


app.post("create-employee",function(req,res){
    const eName = req.body.name;
    const eEmail = req.body.email;
    const eMob = req.body.mobileNo;
    const eDes = req.body.designation;
    const eGen = req.body.gender;
    const eCour = req.body.course;

    const newEmployee = new Employee({
        name: eName,
        email: eEmail,
        mobileNo: eMob,
        designation: eDes,
        gender: eGen,
        course: eCour
    });

    newEmployee.save(function(err) {
        if (err) {
            res.status(500).send({ error: err });
        } else {
            res.status(200).send({ message: "Employee created successfully!" });
        }
    });
})


app.post("/update-employee", function(req, res) {
    const updatedEmployee = {
        name: req.body.name,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        designation: req.body.designation,
        gender: req.body.gender,
        course: req.body.course
    };

    Employee.findByIdAndUpdate(req.body.id, updatedEmployee, function(err) {
        if (err) {
            console.log(err);
            res.status(500).send({ error: err });
        } else {
            res.redirect("/employee-list");
        }
    });
});


app.listen(3000, function(){
    console.log("Server started on port 3000.");
});
