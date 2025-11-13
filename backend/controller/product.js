const mongoose = require("mongoose");
const productModel = require("../model/product");

const getProducts = async (req, res) => {
  try {
    const products = await productModel.find({}, { __v: 0 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// GET product by ID
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const product = await productModel.findById(id, { __v: 0 });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// CREATE product
const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    if (req.file) {
      productData.productImage = `/uploads/${req.file.filename}`;
    }

    const { productName, productPrice, productDescription, productStock, productCategory } = productData;
    if (!productName || !productPrice || !productDescription || !productStock || !productCategory)
      return res.status(400).json({ message: "All fields are required" });

    const newProduct = new productModel(productData);
    await newProduct.save();

    res.status(201).json({ message: "Product created successfully", data: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    if (req.file) updatedData.productImage = `/uploads/${req.file.filename}`;

    const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const product = await productModel.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
