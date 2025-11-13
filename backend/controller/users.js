const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const usersModel = require("../model/users");
const dotenv = require("dotenv");
const sendemail = require("../utility/sendemail");
const jwt = require("jsonwebtoken");
const tokenModel = require("../model/token");
const crypto = require("crypto");



dotenv.config();

// ✅ Get all users (admin only)
const getusers = async (req, res) => {
  try {
    const users = await usersModel.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// ✅ Get user by ID
const getUserid = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const user = await usersModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Delete user
const userdel = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const user = await usersModel.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted", data: user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const signupUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    // ✅ Allow only Gmail addresses
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailPattern.test(email))
      return res.status(400).json({ message: "Only Gmail addresses are allowed" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    // ✅ Check if email already exists in DB
    const existingUser = await usersModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new usersModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      role: "user",
    });

    await newUser.save();

    try {
      await sendemail(newUser.email, "Your OTP Code", newUser.firstName, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully. OTP sent to email.",
      data: {
        token,
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// ✅ Login user
const logininUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await usersModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Successful login",
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Update user
const userupdate = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const updatedUser = await usersModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await tokenModel.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
      status: true
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    sendemail(user.email, "Password Reset Request", user.firstName, resetLink);

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, newpassword } = req.body;
    if (!token || !newpassword)
      return res.status(400).json({ message: "Token and new password are required" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const storedToken = await tokenModel.findOne({
      token: hashedToken,
      status: true,
      expiresAt: { $gt: Date.now() }
    });

    if (!storedToken) return res.status(400).json({ message: "Invalid or expired token" });

    const user = await usersModel.findById(storedToken.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newpassword, 10);
    await user.save();

    storedToken.status = false;
    await storedToken.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getusers,
  getUserid,
  userupdate,
  userdel,
  signupUser,
  logininUser,
  requestPasswordReset,
  resetPassword
};
