const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

const app = express();
app.use(bodyParser.json());

// Helper function to generate a 5-digit OTP (as string)
function generateOTP() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// Configure Cloudinary (replace with your actual credentials)
try {
  cloudinary.config({
    cloud_name: "dhdz1ujwf",
    api_key: "918525894218944",
    api_secret: "qvLTdWU3AIpNPjyc3TKP5AwiFS0",
  });
  console.log("Cloudinary configured");
} catch (err) {
  console.log(err);
}

// Multer configuration for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

mongoose.connect("mongodb+srv://Admin:Admin123456@cluster0.p39wp.mongodb.net/VFood?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log(error));

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: Number,
  phone: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avt: String, // URL of the image stored on Cloudinary
  otp: String,
  verified: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testnixomg123@gmail.com",
    pass: "ltexccimxocdqeiv",
  },
});

app.post("/register", async (req, res) => {
  const { fullName, age, phone, email, password, avt } = req.body;
  const otp = generateOTP();

  try {
    let avtUrl = "";
    if (avt) {
      // Assume avt is a base64 string or a local file path; adjust as needed
      const result = await cloudinary.uploader.upload(avt, { folder: "VFood/Profile" });
      avtUrl = result.secure_url;
    }

    const user = new User({
      fullName,
      age,
      phone,
      email,
      password,
      avt: avtUrl,
      otp,
      verified: false,
    });
    await user.save();

    transporter.sendMail(
      {
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`,
      },
      (err, info) => {
        if (err) {
          return res.status(500).send("Error sending email");
        }
        res.status(200).send("OTP sent to email");
      }
    );
  } catch (err) {
    res.status(500).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: "User not found" });
    if (user.password !== password)
      return res.status(400).send({ message: "Incorrect password" });
    if (!user.verified)
      return res.status(400).send({ message: "User not verified. Please verify your account." });
    res.status(200).send({ message: "Login successful" });
  } catch (err) {
    res.status(500).send({ message: "Error logging in", error: err.message });
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    user.otp = otp;
    await user.save();

    transporter.sendMail(
      {
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`,
      },
      (err, info) => {
        if (err) return res.status(500).send("Error sending email");
        res.status(200).send("OTP sent to email");
      }
    );
  } catch (err) {
    res.status(500).send("Error processing request");
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp, purpose } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && user.otp === otp) {
      user.verified = true;
      user.otp = ""; // Clear OTP after verification
      await user.save();

      if (purpose === "register") {
        res.status(200).send("User verified and registered");
      } else if (purpose === "resetPassword") {
        res.status(200).send("User verified for password reset");
      } else if (purpose === "update") {
        res.status(200).send("User email/phone verified after update");
      } else {
        res.status(200).send("OTP verified successfully");
      }
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (err) {
    res.status(500).send("Error verifying OTP");
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && user.verified) {
      user.password = newPassword;
      await user.save();
      res.status(200).send("Password reset successful");
    } else {
      res.status(400).send("User not verified");
    }
  } catch (err) {
    res.status(500).send("Error resetting password");
  }
});

app.get("/get-profile", async (req, res) => {
  const { email } = req.query;
  try { 
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");
    
    // Remove sensitive fields
    const { password, otp, ...safeUser } = user.toObject();

    res.status(200).send(safeUser);
  } catch (err) {
    res.status(500).send("Error getting profile");
  }
});

app.put("/update-profile", async (req, res) => {
  const { email, newFullName, newAge, newPhone, newEmail, newAvt } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    // Update text fields if provided
    if (newFullName) user.fullName = newFullName;
    if (newAge) user.age = newAge;

    // Update avatar if provided
    if (newAvt) {
      const result = await cloudinary.uploader.upload(newAvt, { folder: "VFood/Profile" });
      user.avt = result.secure_url;
    }

    // Check if email or phone is being updated
    let requireVerification = false;
    if (newEmail && newEmail !== user.email) {
      user.email = newEmail;
      requireVerification = true;
    }
    if (newPhone && newPhone !== user.phone) {
      user.phone = newPhone;
      requireVerification = true;
    }

    if (requireVerification) {
      user.verified = false;
      user.otp = generateOTP();
      transporter.sendMail(
        {
          to: user.email,
          subject: "OTP Verification for Profile Update",
          text: `Your OTP is ${user.otp}`,
        },
        (err, info) => {
          if (err) return res.status(500).send("Error sending OTP email");
        }
      );
    }

    await user.save();
    res.status(200).send("Profile updated successfully. " + (requireVerification ? "Please verify your email (OTP sent)." : ""));
  } catch (err) {
    res.status(500).send("Error updating profile");
  }
});

// New endpoint for uploading avatar file
app.post("/upload-avatar", upload.single("avtFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  let cld_upload_stream = cloudinary.uploader.upload_stream((error, result) => {
    if (error) {
      return res.status(500).send("Error uploading image");
    }
    // Return the secure URL of the uploaded image
    res.status(200).send({ avtUrl: result.secure_url });
  });

  streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
});

app.get("/", (req, res) => {
  res.send("Welcome to VFood API");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});