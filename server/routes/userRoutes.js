const express = require("express");
const {protect, adminOnly} = require("../middleware/authMiddleware");
const { getUsers, getUserById } = require("../controllers/userController");
const router = express.Router();

//User Management Routes
router.get("/", protect, adminOnly, getUsers); //Get all users (Admin Only)
router.get("/:id", protect, getUserById); //get a specific user


module.exports = router;