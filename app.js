// // 
// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const pg = require("pg");
// const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");
// const session = require('express-session');
// const passport = require("passport");
// const Strategy = require("passport-local").Strategy;

// const app = express();
// const db = new pg.Client({
//     user: "postgres",
//     host: "localhost",
//     database: "admin",
//     password: "123456",
//     port: 5432,
// });
// db.connect();

// // const Employee = require('./models/employee');

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({ secret: "Secure", resave: false, saveUninitialized: true }));

// app.use(passport.initialize());
// app.use(passport.session());

// app.set('view engine', 'ejs');

// app.get("/", function (req, res) {
//     res.render("login")
// });

// app.post("/login", passport.authenticate("local", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/login",
// }));

// passport.use(new Strategy(async function verify(username, password, cb) {
//     try {
//         const result = await db.query("SELECT * FROM user WHERE email = $1", [username]);
//         if (result.rows.length > 0) {
//             const user = result.rows[0];
//             const storedPassword = user.password;
//             if (password === storedPassword) {
//                 return cb(null, user);
//             } else {
//                 return cb(null, false);
//             }
//         } else {
//             return cb("User not found");
//         }
//     } catch (err) {
//         cb(err);
//     }
// }));

// passport.serializeUser((user, cb) => {
//     cb(null, user);
// });

// passport.deserializeUser((user, cb) => {
//     cb(null, user);
// });

// app.get("/createEmployee", function (req, res) {
//     if (req.isAuthenticated()) {
//         res.render("Create_Employee");
//     } else {
//         res.render("login");
//     }
// });

// app.get("/employee-list", function (req, res) {
//     if (req.isAuthenticated()) {
//         Employee.find({}, function (err, employees) {
//             if (err) {
//                 console.log(err);
//                 res.status(500).send({ error: err });
//             } else {
//                 res.render("employee-list", { employees: employees });
//             }
//         });
//     } else {
//         res.render("login");
//     }
// });

// app.get("/employee_edit", function (req, res) {
//     if (req.isAuthenticated()) {
//         res.render("Employee_Edit");
//     } else {
//         res.render("login");
//     }
// });

// app.get("/logout", function (req, res) {
//     req.logout();
//     res.redirect('/');
// });

// app.post("/create-employee", function (req, res) {
//     const newEmployee = new Employee({
//         name: req.body.name,
//         email: req.body.email,
//         mobileNo: req.body.mobileNo,
//         designation: req.body.designation,
//         gender: req.body.gender,
//         course: req.body.course
//     });

//     newEmployee.save(function (err) {
//         if (err) {
//             res.status(500).send({ error: err });
//         } else {
//             res.status(200).send({ message: "Employee created successfully!" });
//         }
//     });
// });

// app.post("/update-employee", function (req, res) {
//     const updatedEmployee = {
//         name: req.body.name,
//         email: req.body.email,
//         mobileNo: req.body.mobileNo,
//         designation: req.body.designation,
//         gender: req.body.gender,
//         course: req.body.course
//     };

//     Employee.findByIdAndUpdate(req.body.id, updatedEmployee, function (err) {
//         if (err) {
//             console.log(err);
//             res.status(500).send({ error: err });
//         } else {
//             res.redirect("/employee-list");
//         }
//     });
// });

// app.listen(3000, function () {
//     console.log("Server started on port 3000.");
// });

const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const multer = require('multer');
const upload = multer();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {

    const email = req.body.username;
    const password = req.body.password;
    if(email==="1@2.com" && password  === "123"){
        res.render("dashboard");
    }else{
        res.render("login");
    }
});

app.get('/createEmployee', (req, res) => {
    res.render('CreateEmployee');
});

const employee = [];
let count = 0;

app.post('/addEmployee', upload.single('imageUpload'), (req, res) => {

    const { name, email, mobileNo, designation, gender, course } = req.body;

    if (!name || !email || !mobileNo || !designation || !gender || !course || !req.file) {
        // handle error here, one of the fields is missing
        console.log('One of the fields is missing');
        return res.status(400).send('One of the fields is missing');
    }

    const temp = {
        _id: count,
        name,
        email,
        mobileNo,
        designation,
        gender,
        course,
        imageUpload: req.file // use req.file for the uploaded file
    };
    count++;

    employee.push(temp);
    console.log(temp);

    res.render("Employee_list",{employees: employee});
});

app.get("/employee_edit/:id",(req,res)=>{

    const eId = req.params.id;
    const eData = employee[eId];
    res.render("Employee_Edit",{employee: eData})

})

app.post("/update-employee/:id", upload.single('imageUpload'), (req, res) => {
    const eId = req.params.id;
    const { name, email, mobileNo, designation, gender, course } = req.body; 
    const idx = employee.length-1;


    const temp = {
        _id: idx,
        name,
        email,
        mobileNo,
        designation,
        gender,
        course,
        imageUpload: req.file // use req.file for the uploaded file
    };
    count++;
    // Update the employee
    employee.push(temp);
    employee.splice(eId,1);

    res.render("Employee_List", { employees: employee });
});

app.get('/employee-list', (req, res) => {
    res.render('Employee_List',{employees:employee});
});

app.get('/employee_delete/:id', (req, res) => {
    const eId = req.params.id;
    employee.splice(eId,1);
    res.render('Employee_List',{employees:employee});
});
app.get('/logout', (req, res) => {
    res.render('login');
});

// app.get('/home', (req, res) => {
//     res.render('home');
// });



// app.get('/employee_edit/:id', (req, res) => {
//     res.render('employee_edit', { id: req.params.id });
// });

// app.post('/delete_employee/:id', (req, res) => {
//     db.run(`DELETE FROM employees WHERE id = ?`, req.params.id, function(err) {
//         if (err) {
//             return console.error(err.message);
//         }
//         res.redirect('/employee_list');
//     });
// });


// app.post('/create_employee', (req, res) => {
//     db.run(`INSERT INTO employees(name, position) VALUES(?, ?)`, [req.body.name, req.body.position], function(err) {
//         if (err) {
//             return console.error(err.message);
//         }
//         res.redirect('/employee_list');
//     });
// });

app.listen(3000);

