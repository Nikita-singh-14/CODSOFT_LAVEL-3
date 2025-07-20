const express = require("express");
const {protect, adminOnly} = require("../middlewares/authMiddleware");
const { getUsers, getUserById } = require("../controllers/userController");

const router = express.Router();


//User Management Routes
router.get("/", protect, adminOnly, getUsers); //Get all users (Admin Only)
router.get("/:id", protect, getUserById); //get a specific user
//router.delete("/:id", protect, adminOnly, deleteUser); //Delete user (Admin only)


module.exports = router;