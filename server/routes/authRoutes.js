const express = require("express");
const {registerUser, loginUser, getUserProfile, updateUserProfile} = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

//Auth Routes
router.post("/register", registerUser);  //Register User
router.post("/login", loginUser);  //login User
router.get("/profile", protect, getUserProfile);  //get user profile
router.put("/profile", protect, updateUserProfile);  //update user profile

router.post("/upload-image", upload.single("image"), (req, res) => {
    if(!req.file) {
        return res.status(400).json({message: "No file uploaded"});
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    res.status(200).json({imageUrl});
});

module.exports = router;