const mongoose = require("mongoose");
const crypto = require("crypto");
const tokenModel = require("../model/token"); // ✅ Correct relative path

// Create token
let createToken = async (userId) => {
  try {
    const tokenValue = crypto.randomBytes(32).toString("hex"); // Secure token
    const newToken = new tokenModel({
      userid: userId,
      token: tokenValue,
      status: true
    });
    await newToken.save();
    return { success: true, token: tokenValue };
  } catch (error) {
    console.error("Error creating token:", error);
    return { success: false, error: error.message };
  }
};

// Verify token
let verifyToken = async (tokenValue) => {
  try {
    const tokenData = await tokenModel.findOne({
      token: tokenValue,
      status: true
    });

    if (!tokenData) {
      return { success: false, message: "Invalid or expired token" };
    }
    return { success: true, userId: tokenData.userid };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createToken,
  verifyToken
};
