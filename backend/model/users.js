const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  status: { type: String, default: "deactive" },
  address: { type: String, },
  phone: { type: String, },
  otp: { type: String  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ✅ Prevent OverwriteModelError
const usersModel = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = usersModel;
