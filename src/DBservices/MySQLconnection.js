const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "efix"
  });
  
  con.connect(function(err) {
    if (err) throw err; console.log("Could not connect to MySQL database for E-Fix!");
    console.log("Connected to MySQL database for E-Fix!");
  });

module.exports = con;