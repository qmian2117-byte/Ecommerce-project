const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router.post("/cart/add/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (!req.session.cart) {
    req.session.cart = [];
  }

  const cartItemIndex = req.session.cart.findIndex(
    (item) => item.productId == productId
  );

  if (cartItemIndex === -1) {
    req.session.cart.push({
      productId: productId,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  } else {
    req.session.cart[cartItemIndex].quantity += 1;
  }

  // Return the updated cart count instead of redirecting
  return res.json({ cartCount: req.session.cart.length });
});

// router.post("/cart/add/:productId", async (req, res) => {
//   const productId = req.params.productId;
//   const product = await Product.findById(productId);

//   if (!req.session.cart) {
//     req.session.cart = [];
//   }

//   const cartItemIndex = req.session.cart.findIndex(
//     (item) => item.productId == productId
//   );

//   if (cartItemIndex === -1) {
//     req.session.cart.push({
//       productId: productId,
//       name: product.name,
//       price: product.price,
//       quantity: 1,
//     });
//   } else {
//     req.session.cart[cartItemIndex].quantity += 1;
//   }

//   // Return the updated cart count instead of redirecting
//   res.redirect(`/products/${productId}`);
// });

router.post("/cart/increase/:id", (req, res) => {
  const productId = req.params.id;

  if (req.session.cart) {
    const cartItemIndex = req.session.cart.findIndex(
      (item) => item.productId == productId
    );
    if (cartItemIndex !== -1) {
      req.session.cart[cartItemIndex].quantity += 1;
    }
  }
  res.redirect("/cart");
});

router.post("/cart/decrease/:id", (req, res) => {
  const productId = req.params.id;

  if (req.session.cart) {
    const cartItemIndex = req.session.cart.findIndex(
      (item) => item.productId == productId
    );
    if (cartItemIndex !== -1 && req.session.cart[cartItemIndex].quantity > 1) {
      req.session.cart[cartItemIndex].quantity -= 1;
    }
  }
  res.redirect("/cart");
});

router.post("/cart/remove/:id", (req, res) => {
  const productId = req.params.id;

  req.session.cart = req.session.cart.filter(
    (item) => item.productId != productId
  );
  res.redirect("/cart");
});

router.get("/checkout", (req, res) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    return res.redirect("/products");
  }

  res.render("checkout", {
    title: "Checkout",
    cart: req.session.cart,
  });
});

router.post("/checkout/complete", (req, res) => {
  const { name, address } = req.body;

  req.session.cart = [];

  res.render("checkoutComplete", {
    title: "Checkout Complete",
    name: name,
    address: address,
  });
});

router.get("/cart", (req, res) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    return res.render("cart", { title: "Your Cart", cart: [] });
  }

  res.render("cart", {
    title: "Your Cart",
    cart: req.session.cart,
  });
});

module.exports = router;
