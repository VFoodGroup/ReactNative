const Product = require("../models/productModel");
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
    const { search, minPrice, maxPrice, sortBy, sortOrder, page = 1, limit = 10 } = req.query;
    const filter = {};

    // Tìm kiếm theo tên sản phẩm
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Lọc theo giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sắp xếp (Mặc định: Giá tăng dần)
    let sort = { price: 1 };  
    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      sort[sortBy] = order;
    }

    // Chuyển `page` và `limit` thành số
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const pageSize = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (pageNumber - 1) * pageSize;

    // Lấy tổng số sản phẩm (để hỗ trợ phân trang phía client)
    const totalProducts = await Product.countDocuments(filter);

    // Truy vấn sản phẩm
    const products = await Product.find(filter)
      .populate("category")
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    res.status(200).send({
      total: totalProducts,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(totalProducts / pageSize),
      products,
    });
  } catch (err) {
    res.status(500).send({ message: "Error fetching products", error: err.message });
  }
};



// Retrieve a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).send({ message: "Product not found" });
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ message: "Error fetching product", error: err.message });
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