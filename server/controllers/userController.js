const bcrypt = require("bcryptjs");
const connection = require("../config/db");

// ================= REGISTER USER =================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all fields"
      });
    }

    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          return res.status(500).json({
            message: "Database error"
          });
        }

        if (results.length > 0) {
          return res.status(400).json({
            message: "Email already registered"
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Every newly registered account is a normal user
        connection.query(
          `INSERT INTO users (name, email, password, role)
           VALUES (?, ?, ?, 'user')`,
          [name, email, hashedPassword],
          (error, result) => {
            if (error) {
              console.log(error);

              return res.status(500).json({
                message: "Registration failed"
              });
            }

            res.status(201).json({
              message: "User registered successfully",
              userId: result.insertId
            });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ================= LOGIN USER =================

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password"
    });
  }

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (results.length === 0) {
        return res.status(400).json({
          message: "User not found"
        });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Incorrect password"
        });
      }

      // Login successful
      return res.status(200).json({
        message: "Login successful",

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
  );
};


module.exports = {
  registerUser,
  loginUser
};