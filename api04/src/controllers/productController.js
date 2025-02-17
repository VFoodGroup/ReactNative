const Product = require("../models/ProductModel");
const cloudinary = require("../config/cloudinaryConfig");
const streamifier = require("streamifier");

// Helper function to upload a file buffer to Cloudinary (folder: VFood/Product)
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "VFood/Product" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// Create a new product (supports multiple image uploads)
exports.createProduct = async (req, res) => {
  try {
    const { name, quantity, price, tag, category, description, star } = req.body;
    let imageUrls = [];

    // Upload images if files provided via multer middleware (expects field "images")
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        imageUrls.push(url);
      }
    } else if (req.body.images) {
      // Use images provided in request body (should be an array or a single URL)
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
      return res.status(400).send("At least one image is required");
    }

    const product = new Product({
      name,
      quantity,
      price,
      tag,
      category,
      description,
      images: imageUrls,  // Ensure your Product model has an "images" array field
      star,
    });
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send("Error creating product: " + err.message);
  }
};

// Retrieve all products with search, filter, and sorting
exports.getProducts = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, sortBy, sortOrder } = req.query;
    const filter = {};

    // Search filter: finds products with names matching search term (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Price filter: filter products within a price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sorting: sort by the provided field and order (default: createdAt descending)
    let sort = {};
    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      sort[sortBy] = order;
    } else {
      sort = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .populate("category")
      .sort(sort);
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send("Error fetching products: " + err.message);
  }
};

// Retrieve a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).send("Product not found");
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send("Error fetching product: " + err.message);
  }
};

// Update a product by ID (supports updating images)
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If files are provided via multer middleware, upload and update images
    if (req.files && req.files.length > 0) {
      let imageUrls = [];
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        imageUrls.push(url);
      }
      updateData.images = imageUrls;
    } else if (req.body.images) {
      updateData.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).send("Product not found");
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send("Error updating product: " + err.message);
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).send("Error deleting product: " + err.message);
  }
};