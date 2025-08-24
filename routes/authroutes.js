// Import required modules
const express = require("express");
const { Usermodels } = require("../models/usermodels"); // Import User model for database operations
const bcryptjs = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For JWT token generation and verification
const authroutes = require("../middlewares/authmiddleware"); // Import authentication middleware
// const { Usermodels } = require('../models/usermodels');

// Create a new router instance
const authRouter = express.Router();

// Sign Up route - Handles user registration
authRouter.post("/api/signup", async (req, res) => {
  try {
    // Destructure request body to get user details
    const { name, email, password } = req.body;

    // Check if user already exists in database
    const existingUser = await Usermodels.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password for security
    const hashedPassword = await bcryptjs.hash(password, 8);

    // Create new user instance with hashed password
    let user = new Usermodels({
      email: email,
      password: hashedPassword,
      name: name,
    });

    // Save user to database
    user = await user.save();

    // Return the created user object with a success message
    res.json({ msg: "Signup successful", user: user }); //remove this msg
  } catch (error) {
    // Handle any errors during signup process
    res.status(500).json({ error: error.message });
  }
});

// Sign In route - Handles user authentication
authRouter.post("/api/login", async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Find user by email
    const user = await Usermodels.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist" });
    }

    // Verify password matches hashed password in database
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    // Generate JWT token with user ID and 12-hour expiration
    const token = jwt.sign({ id: user._id }, "passwordKey", {
      expiresIn: "12h",
    });

    // Return token and user data with a success message
    res.json({ msg: "Login successful", token: token, ...user._doc }); //remove this msg
  } catch (e) {
    // Handle any errors during login process
    res.status(500).json({ error: e });
  }
});

// Token Validation route - Verifies if a token is valid
authRouter.post("/api/tokenIsValid", async (req, res) => {
  try {
    // Get token from request header
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    // Verify token using secret key
    const isVerified = jwt.verify(token, "passwordKey");
    if (!isVerified) return res.json(false);

    // Check if user exists in database
    const user = await Usermodels.findById(isVerified.id);
    if (!user) return res.json(false);

    // Return true if token is valid
    res.json(true);
  } catch (e) {
    // Handle any errors during token validation
    res.status(500).json({ error: e });
  }
});

// Get User Data route - Protected route that requires authentication
authRouter.get("/", authroutes, async (req, res) => {
  const user = await Usermodels.findById(req.user).populate("cart.product");

  // Return user data and token
  res.json({ ...user._doc, token: req.token });
});

// Get user data
authRouter.get("/", authroutes, async (req, res) => {
  const user = await Usermodels.findById(req.user).populate("cart.product");
  res.json({ ...user._doc, token: req.token });
});

authRouter.get("/hello", (req, res) => {
  res.send("Hello World");
});

// Export the router for use in other files
module.exports = authRouter;
