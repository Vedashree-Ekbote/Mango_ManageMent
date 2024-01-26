const mysql=require('mysql2');

const db= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Vedashree@25',
    database:'mango_manage',
    port:'3306',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL');
    }
});


module.exports = { db };