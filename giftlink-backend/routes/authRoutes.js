// Step 1 - Task 2: Import necessary packages
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const connectToDatabase = require('../models/db');
const logger = require('../logger'); // Step 1 - Task 3: Create a Pino logger instance
const { body, validationResult } = require('express-validator'); // Import for validation

dotenv.config();

// Step 1 - Task 4: Create JWT secret
const jwtSecret = process.env.JWT_SECRET;

// POST /api/auth/register (FROM PREVIOUS LAB)
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            logger.error('User already exists with this email');
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;
        const newUser = await collection.insertOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            createdAt: new Date()
        });
        const payload = {
            user: {
                id: newUser.insertedId
            }
        };
        const authtoken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
        logger.info('User registered successfully');
        res.json({ authtoken, email });
    } catch (e) {
        logger.error(e.message);
        return res.status(500).send('Internal server error');
    }
});


// POST /api/auth/login (FROM PREVIOUS LAB)
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({ email: req.body.email });
        if (!user) {
            logger.error('User not found');
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const passwordCompare = await bcryptjs.compare(req.body.password, user.password);
        if (!passwordCompare) {
            logger.error('Password mismatch');
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const userName = `${user.firstName} ${user.lastName}`;
        const userEmail = user.email;
        const payload = {
            user: {
                id: user._id
            }
        };
        const authtoken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
        logger.info('User logged in successfully');
        res.json({ authtoken, userName, userEmail });
    } catch (e) {
        logger.error(e.message);
        return res.status(500).send('Internal server error');
    }
});

// PUT /api/auth/update (NEW CODE FOR THIS LAB)
router.put('/update', [
    // Validation middleware for the request body
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required')
], async (req, res) => {
    try {
        // Task 2: Validate the input using validationResult
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Task 3: Check if `email` is present in the header
        const email = req.header('email');
        if (!email) {
            return res.status(401).json({ error: "Authentication error: email missing from header" });
        }

        // Task 4: Connect to MongoDB and access users collection
        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Task 5: Find user credentials in database
        const existingUser = await collection.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUserData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            updatedAt: new Date()
        };

        // Task 6: Update user credentials in database
        await collection.updateOne(
            { _id: existingUser._id },
            { $set: updatedUserData }
        );

        // Task 7: Create JWT authentication with user._id as payload
        const payload = {
            user: {
                id: existingUser._id
            }
        };
        const authtoken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        logger.info('User updated successfully');
        res.json({ authtoken });

    } catch (e) {
        logger.error(e.message);
        return res.status(500).send('Internal server error');
    }
});


module.exports = router;