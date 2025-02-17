const cloudinary = require("../config/cloudinaryConfig");
const generateOTP = require("../utils/GenerateOTP");
const otpVerify = require("../utils/OTPVerify.js");
const User = require("../models/UserModel");
const sendMail = require("../utils/SendMail.js");

// Register user
exports.register = async (req, res) => {
  const { fullName, age, phone, email, password, avt } = req.body;
  const otp = generateOTP();

  try {
    let avtUrl = "";
    if (avt) {
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

    const mailOptions = {
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    };

    sendMail(mailOptions, (err) => {
      if (err) return res.status(500).send("Error sending email");
      res.status(200).send("OTP sent to email");
    });
  } catch (err) {
    res.status(500).send("Error registering user");
  }
};

// Login user
exports.login = async (req, res) => {
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
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    user.otp = otp;
    await user.save();

    const mailOptions = {
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    };

    sendMail(mailOptions, (err) => {
      if (err) return res.status(500).send("Error sending email");
      res.status(200).send("OTP sent to email");
    });
  } catch (err) {
    res.status(500).send("Error processing request");
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp, purpose } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && otpVerify(user.otp, otp)) {
      user.verified = true;
      user.otp = "";
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
};

// Reset password
exports.resetPassword = async (req, res) => {
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
};