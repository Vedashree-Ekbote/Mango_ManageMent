const express=require ('express');
const cors=require('cors');
const body_parser=require('body-parser');
const { db } = require('./conn');
const nodemon = require('nodemon');
const app=express();

app.use(cors({
    origin: 'http://localhost:3000',
  }));
  
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));


app.get('/',(req,res)=>{
    return res.json("Hello! from Backend");
})

//Sign Up of User
app.post('/register',(req,res)=>{
    const {email,username,password}=req.body;
    
    const user_sql='INSERT INTO user (email,username,password) VALUES(?,?,?)';
    db.query(user_sql,[email,username,password],(err,result)=>{
        if(err){
            console.log("error while registring",err);
            res.status(500).json({ error: 'Internal server error' });
        }else{
            console.log('User registered successfully:');
            res.status(200).json({ message: 'User registerd in successfully'});
        }
    });
});

//User login
app.post('/login',(req,res)=>{
    const {username,password}=req.body;

    const login_sql='SELECT * from user WHERE username=? AND password=?';

    db.query(login_sql,[username,password],(err,result)=>{
        const user = result[0];
        if(err){
            console.log("error while logging in",err);
            res.status(500).json({ error: 'Internal server error' });
        }else{
            if (result.length > 0) {
                console.log('User logged in successfully');
                res.status(200).json({ message: 'User logged in successfully' , user});
              } else {
                console.log('Invalid credentials');
                res.status(401).json({ error: 'Invalid credentials' });
              }
        }
    });
});


app.get('/user/:username', (req, res) => {
    const { username } = req.params;
    const getUserDetailsSql = 'SELECT user_id, email, username FROM user WHERE username=?';
    db.query(getUserDetailsSql, [username], (err, result) => {
      if (err) {
        console.log('Error fetching user details:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        const user = result[0] || {};
        const {user_id}=user;

        res.status(200).json({ user });
      }
    });
  });

  
//admin login
app.post('/adminlogin' ,(req,res)=>{
    const {email,username,password}=req.body;
    if(username=="admin" && password=="admin@123"){
        console.log('Admin logged in successfully');
            res.status(200).json({ message: 'Admin logged in successfully' });
    }else{
        console.log('Invalid credentials');
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/savedata',(req,res)=>{
  const dataToSave=req.body;
  console.log('Received data:', dataToSave);
  const insertDataSql = 'INSERT INTO sale (boxtype, BoxNo, Customer, Amount, ModeOfPayment,Date) VALUES ?';
  const values = dataToSave.map((row) => [row.Type, row.BoxNo, row.Customer, row.Amount, row.ModeOfPayment,row.Date]);
  db.query(insertDataSql, [values], (err, result) => {
    if (err) {
      console.log('Error saving data:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Data saved successfully');
      res.status(200).json({ message: 'Data saved successfully' });
    }
  });
});

app.listen(3001,()=>{
    console.log("Listening on port 3001!")
})