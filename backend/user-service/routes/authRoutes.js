const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");
const sendResponse = require("../utils/response");


const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    try {
        const { name, phone, address, bloodGroup, email, password } = req.body;

        if (!name || !phone || !address || !bloodGroup || !email || !password) {
            logger.warn(`Registration failed: missing fields for email ${email || "N/A"}`);
            return sendResponse(res, 400, false, "All fields are required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn(`Registration failed: email already registered - ${email}`);
            return sendResponse(res, 400, false, "Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            phone,
            address,
            bloodGroup,
            email,
            password: hashedPassword,
        });

        await user.save();

        logger.info(`User registered successfully: ${email}`);
        sendResponse(res, 201, true, "User registered successfully");
    } catch (err) {
        logger.error(`Registration error: ${err.stack}`);
        sendResponse(res, 500, false, "Server error", null, err.message);
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Login failed: invalid email - ${email}`);
            return sendResponse(res, 400, false, "Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Login failed: invalid password for email - ${email}`);
            return sendResponse(res, 400, false, "Invalid email or password");
        }

        const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        logger.info(`User logged in: ${email}`);
        sendResponse(res, 200, true, "Login successful", { token });
    } catch (err) {
        logger.error(`Login error for email ${req.body.email}: ${err.stack}`);
        sendResponse(res, 500, false, "Server error", null, err.message);
    }
});

// Health check
router.post("/healthCheck", (req, res) => {
    logger.info("Health check called on User service");
    sendResponse(res, 200, true, "User service is healthy");
});

module.exports = router;
