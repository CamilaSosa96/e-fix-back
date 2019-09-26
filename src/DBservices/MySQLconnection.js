const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "efix"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL database for E-Fix!");
  });

module.exports = con;