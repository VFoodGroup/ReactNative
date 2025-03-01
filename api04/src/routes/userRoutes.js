const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const userController = require("../controllers/userController");

// Profile endpoints
router.get("/",userController.getUsers)
router.get("/get-profile", userController.getProfile);
router.put("/update-profile", userController.updateProfile);
router.post("/upload-avatar", upload.single("avtFile"), userController.uploadAvatar);

module.exports = router;