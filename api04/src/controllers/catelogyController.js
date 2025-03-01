const CateLogy = require("../models/CatelogyModel");
const cloudinary = require("../config/cloudinaryConfig");
const streamifier = require("streamifier");

// Helper function to upload a file buffer to Cloudinary (folder: VFood/Category)
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "VFood/Category" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// Create a new category
exports.createCateLogy = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).send("Name is required");

    let imageUrl = "";
    // If file is provided (via multer middleware)
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    } else if (req.body.image) {
      // Fallback: use image url from body if available
      imageUrl = req.body.image;
    } else {
      return res.status(400).send("Image is required");
    }

    const cateLogy = new CateLogy({ name, image: imageUrl, description });
    await cateLogy.save();
    res.status(201).send(cateLogy);
  } catch (err) {
    res.status(500).send("Error creating category: " + err.message);
  }
};

// Retrieve all categories
exports.getCateLogies = async (req, res) => {
  try {
    const categories = await CateLogy.find().sort({ createdAt: -1 });
    res.status(200).send(categories);
  } catch (err) {
    res.status(500).send("Error getting categories: " + err.message);
  }
};

// Retrieve a single category by ID
exports.getCateLogyById = async (req, res) => {
  const { id } = req.params;
  try {
    const cateLogy = await CateLogy.findById(id);
    if (!cateLogy) return res.status(404).send("Category not found");
    res.status(200).send(cateLogy);
  } catch (err) {
    res.status(500).send("Error getting category: " + err.message);
  }
};

// Update a category by ID
exports.updateCateLogy = async (req, res) => {
  const { id } = req.params;
  try {
    const updateData = { ...req.body };

    // If an image file is provided, upload it to cloudinary
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const updatedCateLogy = await CateLogy.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCateLogy) return res.status(404).send("Category not found");
    res.status(200).send(updatedCateLogy);
  } catch (err) {
    res.status(500).send("Error updating category: " + err.message);
  }
};

// Delete a category by ID
exports.deleteCateLogy = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCateLogy = await CateLogy.findByIdAndDelete(id);
    if (!deletedCateLogy) return res.status(404).send("Category not found");
    res.status(200).send({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).send("Error deleting category: " + err.message);
  }
};