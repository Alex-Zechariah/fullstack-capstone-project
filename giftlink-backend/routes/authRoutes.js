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


// POST /api/auth/login (NEW CODE FOR THIS LAB)
router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB
        const db = await connectToDatabase();
        // Task 2: Access MongoDB `users` collection
        const collection = db.collection('users');

        // Task 3: Check for user credentials in database
        const user = await collection.findOne({ email: req.body.email });
        
        // Task 7: Send appropriate message if user not found
        if (!user) {
            logger.error('User not found');
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Task 4: Check if the password matches the encrypted password
        const passwordCompare = await bcryptjs.compare(req.body.password, user.password);
        if (!passwordCompare) {
            logger.error('Password mismatch');
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Task 5: Fetch user details from database (already done by findOne)
        const userName = `${user.firstName} ${user.lastName}`;
        const userEmail = user.email;

        // Task 6: Create JWT authentication if passwords match
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


module.exports = router;