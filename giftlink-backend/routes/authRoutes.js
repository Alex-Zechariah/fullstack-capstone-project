// Step 1 - Task 2: Import necessary packages
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const connectToDatabase = require('../models/db');
const logger = require('../logger'); // Step 1 - Task 3: Create a Pino logger instance

dotenv.config();

// Step 1 - Task 4: Create JWT secret
const jwtSecret = process.env.JWT_SECRET;

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        // Step 2 - Task 1: Connect to `giftsdb` in MongoDB
        const db = await connectToDatabase();

        // Step 2 - Task 2: Access MongoDB collection
        const collection = db.collection('users');

        // Step 2 - Task 3: Check for existing email
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            logger.error('User already exists with this email');
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

        // Step 2 - Task 4: Save user details in database
        const newUser = await collection.insertOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            createdAt: new Date()
        });

        // Step 2 - Task 5: Create JWT authentication with user._id as payload
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

module.exports = router;