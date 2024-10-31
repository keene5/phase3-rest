const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // To generate a unique API key

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
    required: true,
  },
  apiKey: {
    type: String,
    unique: false,
  },
  accessLevel: {
    type: String,
    enum: ['read', 'write', 'admin'],
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);