require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
//const { connect } = require("http2");
const connectDB = require('./config/db');
const authRoutes  = require("./routes/authRoutes");
const userRoutes  = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes")


const app = express();

//Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


//connect Database
connectDB();

//Middleware
app.use(express.json());


//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);


//Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));