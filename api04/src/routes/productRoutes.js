const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import product controller
const productController = require("../controllers/productController");

// Create a new product (expects multiple images with field name "images")
router.post("/", upload.array("images"), productController.createProduct);

// Retrieve all products with search, filter, and sorting
router.get("/", productController.getProducts);

// Retrieve a single product by ID
router.get("/:id", productController.getProductById);

// Update a product by ID (supports updating images with field name "images")
router.put("/:id", upload.array("images"), productController.updateProduct);

// Delete a product by ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;