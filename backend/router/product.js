const express = require("express");
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controller/product");
const { authcheck, checkadmin, upload } = require("./middleware/auth");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin protected routes
router.post("/create", authcheck, checkadmin, upload.single("productImage"), createProduct);
router.put("/:id", authcheck, checkadmin, upload.single("productImage"), updateProduct);
router.delete("/:id", authcheck, checkadmin, deleteProduct);

module.exports = router;
