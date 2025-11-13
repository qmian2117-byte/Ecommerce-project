const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  token: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL: auto-remove expired tokens
  }
}, { timestamps: true });

const tokenModel = mongoose.models.Token || mongoose.model("Token", tokenSchema);

module.exports = tokenModel;
