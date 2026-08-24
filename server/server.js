const requestRoutes = require("./routes/requestRoutes");
const express = require("express");
const cors = require("cors");

const connection = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/requests", requestRoutes);
// User routes
app.use("/api/users", userRoutes);

// Equipment routes
app.use("/api/equipment", equipmentRoutes);

app.get("/", (req, res) => {
  res.send("Equipment Checkout API is running");
});
app.use("/api/dashboard", dashboardRoutes);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});