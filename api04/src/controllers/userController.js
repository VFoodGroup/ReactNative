const cloudinary = require("../config/cloudinaryConfig");
const User = require("../models/UserModel");
const streamifier = require("streamifier");

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const { email } = req.query;
    
    // Validate email parameter
    if (!email) {
      return res.status(400).send("Email parameter is required");
    }

    // Find user with case-insensitive email match
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    console.log("Search email:", email);
    console.log("Found user:", user);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Remove sensitive fields and return user data
    const { password, otp, ...safeUser } = user.toObject();
    res.status(200).send(safeUser);

  } catch (err) {
    console.error("Error in getProfile:", err);
    res.status(500).send("Error getting profile: " + err.message);
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  const { email, newFullName, newAge, newPhone, newEmail, newAvt } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    if (newFullName) user.fullName = newFullName;
    if (newAge) user.age = newAge;

    if (newAvt) {
      const result = await cloudinary.uploader.upload(newAvt, { folder: "VFood/Profile" });
      user.avt = result.secure_url;
    }

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
      user.otp = require("../utils/GenerateOTP")();
      const mailOptions = {
        to: user.email,
        subject: "OTP Verification for Profile Update",
        text: `Your OTP is ${user.otp}`,
      };

      // Note: Error from sendMail during update does not block profile update.
      require("../utils/SendMail")(mailOptions, (err) => {
        if (err) console.log("Error sending OTP email during profile update");
      });
    }

    await user.save();
    res.status(200).send(
      "Profile updated successfully. " +
        (requireVerification ? "Please verify your email (OTP sent)." : "")
    );
  } catch (err) {
    res.status(500).send("Error updating profile");
  }
};

// Upload avatar (using multer - file is provided via middleware)
exports.uploadAvatar = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
    if (error) return res.status(500).send("Error uploading image");
    res.status(200).send({ avtUrl: result.secure_url });
  });

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send("Error getting users: " + err.message);
  }
};