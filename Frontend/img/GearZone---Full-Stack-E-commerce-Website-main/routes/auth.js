const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const trimmedEmail = email;
    // const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = new User({
      username,
      email: trimmedEmail,
      password: password,
    });
    await newUser.save();
    res.status(201).redirect("/signin");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const trimmedEmail = email.trim();

  try {
    const user = await User.findOne({ email: trimmedEmail });
    console.log("User found:", user);

    if (!user) {
      return res.status(401).send("User not found");
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("Comparing password for user:", user.email);
    console.log("Hashed Password:", user.password);
    console.log("Input Password:", password);
    console.log("Password match:", match);

    if (!match) {
      return res.status(401).send("Invalid email or password");
    }

    req.session.userId = user._id;
    res.redirect("/");
  } catch (error) {
    res.status(400).send("Error signing in: " + error.message);
  }
});

module.exports = router;
