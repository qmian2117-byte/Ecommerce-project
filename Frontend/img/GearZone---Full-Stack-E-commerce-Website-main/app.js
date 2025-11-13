const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const cartRoutes = require("./routes/cart");
const authRoutes = require("./routes/auth"); // Import your auth routes

dotenv.config();
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Session middleware (move this before setting res.locals.cart)
app.use(
  session({
    secret: "your-secret-key", // Replace with a secure key
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware for making cart available in views (after session middleware)
app.use((req, res, next) => {
  res.locals.cart = req.session.cart || [];
  next();
});

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set("view engine", "ejs");

// Routes
const productRoutes = require("./routes/productRoutes");
app.use("/products", productRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("home", { title: "GearZone" });
});

app.get("/signin", (req, res) => {
  res.render("signin", { title: "Sign In" });
});

app.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up" });
});

// Add your cart and auth routes
app.use(authRoutes);
app.use(cartRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
