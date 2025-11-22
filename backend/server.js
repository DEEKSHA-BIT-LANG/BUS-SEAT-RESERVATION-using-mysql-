
// backend/server.js
const express = require("express");
const cors = require("cors");
const busRoutes = require("./routes/busRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/buses", busRoutes);
app.use("/api/users", userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
