const mysql = require('mysql')

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'efix'
  })
  
  con.connect((err) => {
    if (err) throw new Error('Could not connect to database!')
    else console.log('Connected to MySQL database for E-Fix!')
  })

module.exports = con;