const bcrypt = require("bcryptjs");
const connection = require("./config/db");

const newPassword = "admin123";

bcrypt.hash(newPassword, 10, (error, hashedPassword) => {
  if (error) {
    console.log(error);
    return;
  }

  connection.query(
    "UPDATE users SET password = ? WHERE role = 'admin'",
    [hashedPassword],
    (error, result) => {
      if (error) {
        console.log("Database error:", error);
      } else {
        console.log("Admin password reset successfully!");
        console.log("New password:", newPassword);
      }

      connection.end();
    }
  );
});