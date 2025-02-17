const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: Number,
  phone: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avt: String, // URL of the image stored on Cloudinary
  otp: String,
  verified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);