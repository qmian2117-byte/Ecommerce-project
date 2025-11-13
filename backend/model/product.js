const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true, unique: true },
  productPrice: { type: Number, required: true },
  productDescription: { type: String, required: true },
  productStock: { type: Number, required: true },
  productCategory: { type: String, required: true },
  productImage: { type: String, default: "" }
});


const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = productModel;
