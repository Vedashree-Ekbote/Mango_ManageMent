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

app.post('/savedata', (req, res) => {
  const { username, tableData } = req.body;

  // Fetch user_id based on the username
  const getUserIdSql = 'SELECT user_id FROM user WHERE username=?';
  db.query(getUserIdSql, [username], (err, userResult) => {
    if (err) {
      console.log('Error fetching user_id:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (userResult.length === 0) {
        console.log('User not found');
        res.status(404).json({ error: 'User not found' });
      } else {
        const user_id = userResult[0].user_id;

        // Prepare SQL query to insert data into the sale table
        const insertDataSql = 'INSERT INTO sale (boxtype, BoxNo, Customer, Amount, ModeOfPayment, SaleDate, user_id) VALUES ?';

        // Prepare values array for insertion
        const values = tableData.map((row) => [
          row.Type,
          row.BoxNo,
          row.Customer,
          row.Amount,
          row.ModeOfPayment,
          row.SaleDate,
          user_id,
        ]);

        // Execute the insert query
        db.query(insertDataSql, [values], (err, result) => {
          if (err) {
            console.log('Error saving data:', err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            console.log('Data saved successfully to sale table');
            // Check if the SaleDate already exists in TotalSale table
            const checkTotalSaleSql = 'SELECT * FROM TotalSale WHERE SaleDate=? AND user_id=?';
            db.query(checkTotalSaleSql, [values[0][5], user_id], (err, totalSaleResult) => {
              if (err) {
                console.log('Error checking TotalSale:', err);
              } else {
                if (totalSaleResult.length === 0) {
                  // If SaleDate does not exist, insert into TotalSale
                  const insertTotalSaleSql = 'INSERT INTO TotalSale (SaleDate, paymentStatus, paymentDate, user_id) VALUES (?, ?, ?, ?)';
                  const currentDate = new Date().toISOString().split('T')[0];
                  db.query(insertTotalSaleSql, [values[0][5], 'pending', currentDate, user_id], (err, totalSaleInsertResult) => {
                    if (err) {
                      console.log('Error saving data to TotalSale:', err);
                    } else {
                      console.log('Data saved to TotalSale successfully');
                    }
                  });
                } else {
                  console.log('SaleDate already exists in TotalSale');
                }
              }
            });
            res.status(200).json({ message: 'Data saved successfully' });
          }
        });
      }
    }
  });
});


// app.get('/api/sales/:username', (req, res) => {
//   const { username } = req.params;

//   // Fetch user_id based on the username
//   const getUserIdSql = 'SELECT user_id FROM user WHERE username=?';

//   // SQL query to get sales data based on user_id
//   const getSaleData = 'SELECT SaleDate, COUNT(BoxNo) AS TotalBoxesSold, SUM(Amount) AS TotalAmount FROM sale WHERE user_id=? GROUP BY SaleDate ORDER BY SaleDate';

//   // SQL query to get payment data from TotalSale table based on user_id
//   const getTotalSaleData = 'SELECT SaleDate, paymentStatus, paymentDate FROM TotalSale WHERE user_id=? ORDER BY SaleDate';

//   // Execute the SQL queries
//   db.query(getUserIdSql, [username], (err, userResult) => {
//     if (err) {
//       console.log('Error fetching user_id:', err);
//       res.status(500).json({ error: 'Internal server error' });
//     } else if (userResult.length === 0) {
//       console.log('User not found');
//       res.status(404).json({ error: 'User not found' });
//     } else {
//       const user_id = userResult[0].user_id;

//       // Execute the SQL queries to fetch sales and payment data
//       db.query(getSaleData, [user_id], (err, salesResult) => {
//         if (err) {
//           console.log('Error fetching sales data:', err);
//           res.status(500).json({ error: 'Internal server error' });
//         } else {
//           db.query(getTotalSaleData, [user_id], (err, totalSaleResult) => {
//             if (err) {
//               console.log('Error fetching total sale data:', err);
//               res.status(500).json({ error: 'Internal server error' });
//             } else {
//               // Combine sales and payment data
//               const combinedData = salesResult.map(sale => {
//                 const totalSaleRow = totalSaleResult.find(totalSale => totalSale.SaleDate === sale.SaleDate);
//                 return {
//                   username,
//                   Date: sale.SaleDate,
//                   TotalBoxesSold: sale.TotalBoxesSold,
//                   TotalAmount: sale.TotalAmount,
//                   PaymentStatus: totalSaleRow ? totalSaleRow.paymentStatus : null,
//                   PaymentDate: totalSaleRow ? totalSaleRow.paymentDate : null
//                 };
//               });

//               // Send combined data as response
//               res.status(200).json({ salesData: combinedData });
//             }
//           });
//         }
//       });
//     }
//   });
// });

app.get('/api/sales/:username', (req, res) => {
  const { username } = req.params;

  // Query to fetch user_id based on the username
  const getUserIdSql = 'SELECT user_id FROM user WHERE username=?';

  // Query to fetch sales data along with payment status and date
  const getSalesDataSql = `
  SELECT s.SaleDate,COUNT(s.BoxNo) AS TotalBoxesSold,SUM(s.Amount) AS TotalAmount,MAX(ts.paymentStatus) AS paymentStatus,MAX(ts.paymentDate) AS paymentDate
FROM
  sale s
LEFT JOIN
  totalsale ts ON s.SaleDate = ts.SaleDate AND s.user_id = ts.user_id
WHERE
  s.user_id = (SELECT user_id FROM user WHERE username = ?)
GROUP BY
  s.SaleDate
ORDER BY
  s.SaleDate;
`;

  // Execute the query to fetch sales data
  db.query(getUserIdSql, [username], (err, userResult) => {
    if (err) {
      console.log('Error fetching user_id:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (userResult.length === 0) {
        console.log('User not found');
        res.status(404).json({ error: 'User not found' });
      } else {
        const userId = userResult[0].user_id;

        db.query(getSalesDataSql, [username, username], (err, salesResult) => {
          if (err) {
            console.log('Error fetching sales data:', err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            const salesData = salesResult.map(row => ({
              Date: row.SaleDate,
              TotalBoxesSold: row.TotalBoxesSold,
              TotalAmount: row.TotalAmount,
              PaymentStatus: row.paymentStatus,
              PaymentDate: row.paymentDate
            }));
            res.status(200).json({ salesData });
            console.log(salesData);
          }
        });
      }
    }
  });
});

app.post('/userpayment', (req, res) => {
  const { username, SaleDate, paymentStatus, paymentDate } = req.body;
  const getUserIdSql = 'SELECT user_id FROM user WHERE username=?';

  db.query(getUserIdSql, [username], (err, result) => {
    if (err) {
      console.log('Error fetching user_id:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (result.length === 0) {
        console.log('User not found');
        res.status(404).json({ error: 'User not found' });
      } else {
        const user_id = result[0].user_id;
        const updateDataSql = 'UPDATE TotalSale SET paymentStatus=?, paymentDate=? WHERE user_id=? AND SaleDate=?';
        const formattedSaleDate = new Date(SaleDate);
        const formattedPaymentDate = new Date(paymentDate).toISOString().split('T')[0];
        db.query(updateDataSql, [paymentStatus, formattedPaymentDate, user_id, formattedSaleDate], (err, result) => {
          if (err) {
            console.error('Error updating user payment data:', err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            console.log('User payment data updated successfully');
            res.status(200).json({ message: 'User payment data updated successfully' });
          }
        });
      }
    }
  });
});


app.listen(3001,()=>{
    console.log("Listening on port 3001!")
})