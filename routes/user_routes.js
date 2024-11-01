const express = require("express");
const validator = require("validator");

const userRouter = express.Router();
const User = require("../model/user.js");
const { v4: uuidv4 } = require("uuid");
const { encryptApiKey, decryptApiKey } = require("../security/encryption.js");

const { models } = require("mongoose");
const checkAccessLevel = require('../middleware/authenticate');

module.exports = userRouter;

userRouter.post('/createUser', async (req, res, next) => {
  const { name, dob, userId, accessLevel } = req.body;

  // Validate the incoming request
  if (!name || !dob || !userId) {
    return res.status(400).json({ message: 'Name, DOB, and userId are required.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(200).json({ apiKey: decryptApiKey(existingUser.apiKey), message: 'User ID already exists' });
    }

    // Generate a new API key
    const apiKey = uuidv4();
    const encryptedApiKey = encryptApiKey(apiKey);

    // Create a new user with the generated API key
    const user = new User({
      name,
      dob,
      userId,
      apiKey: encryptedApiKey,
      accessLevel
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Return the API key to the user
    res.status(201).json({ apiKey, message: 'New user created' });
  } catch (error) {
    console.error('Error during user creation:', error);
    next(error); // Pass errors to the error handling middleware
  }
});

userRouter.delete("/deleteAllUsers", checkAccessLevel(['admin']), async (req, res, next) => {
  try {
    // Delete all documents from the User collection
    const result = await User.deleteMany({});

    // Send a response with the count of deleted documents
    res.status(200).json({ message: "All users deleted successfully", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error during deletion of all users:", error);
    next(error); // Pass errors to the error handling middleware
  }
});

// Error handling middleware
userRouter.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Invalid data type provided.' });
  }

  res.status(500).json({ message: 'Internal server error.' });
});

module.exports = userRouter;