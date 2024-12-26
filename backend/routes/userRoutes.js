const express = require("express");
const bcrypt = require("bcryptjs"); // To hash passwords
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Sign up route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const tokenPayload = { userId: user._id, name: user.name };

    // Create JWT token with user ID
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      "4fC3hG!k9&V2sSyd88#yPZ9oQ7",
      {
        expiresIn: "1h",
      }
    );
    console.log("Token Payload:", tokenPayload);
    console.log("Generated Token:", token); // Log the token

    // Send the token in the response
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/api/user/:id", async (req, res) => {
  console.log("API Hit - Fetch User by ID:", req.params.id); // Debugging
  try {
    const user = await User.findById(req.params.id).select("name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
