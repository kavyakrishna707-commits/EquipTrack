const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const requestRoutes = require("./routes/requestRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());


// ================= ROUTES =================

// Login and Register
app.use("/api/users", userRoutes);

// Equipment
app.use("/api/equipment", equipmentRoutes);

// Equipment Requests
app.use("/api/requests", requestRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);


// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("Equipment Checkout Backend is Running");
});


// ================= START SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});