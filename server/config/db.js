const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "equipment_checkout"
});

connection.connect((error) => {
  if (error) {
    console.log("Database connection failed:", error);
  } else {
    console.log("MySQL Database Connected Successfully!");
  }
});

module.exports = connection;