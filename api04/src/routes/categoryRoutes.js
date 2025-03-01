const express = require("express");
const router = express.Router();
const multer = require("multer");

// Use memory storage so that the file buffer is available for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import catelogy controller
const catelogyController = require("../controllers/catelogyController");

// Create a new category (expects an image file with field name "image")
router.post("/", upload.single("image"), catelogyController.createCateLogy);

// Retrieve all categories
router.get("/", catelogyController.getCateLogies);

// Retrieve a single category by ID
router.get("/:id", catelogyController.getCateLogyById);

// Update a category by ID (if updating image, the file should be provided with field name "image")
router.put("/:id", upload.single("image"), catelogyController.updateCateLogy);

// Delete a category by ID
router.delete("/:id", catelogyController.deleteCateLogy);

module.exports = router;