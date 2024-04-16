// app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(bodyParser.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://ashishgk1999:oeDaWbMGIqMrGdxy@cluster0.slx4esm.mongodb.net/",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
