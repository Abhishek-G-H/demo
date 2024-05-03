
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

app.listen(3000);

