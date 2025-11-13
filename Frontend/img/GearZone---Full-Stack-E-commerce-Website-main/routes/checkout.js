const express = require("express");
const router = express.Router();

router.get("/checkout", (req, res) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    return res.redirect("/cart");
  }

  let total = 0;
  req.session.cart.forEach((item) => {
    total += item.price * item.quantity;
  });

  res.render("checkout", { cart: req.session.cart, total });
});

router.post("/checkout", (req, res) => {
  req.session.cart = [];
  res.redirect("/checkout/confirmation");
});

router.get("/checkout/confirmation", (req, res) => {
  res.render("confirmation");
});

module.exports = router;
