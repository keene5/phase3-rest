const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const dataSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
      default: uuidv4, // Automatically generate a unique ID
      required: true,
    },
    name: {
      required: true,
      type: String,
    },
    dateOfBirth: {
      required: true,
      type: Date,
    },
    region: {
      required: false,
      type: Number,
    },
    email: {
      required: false,
      type: String,
    },
    password: {
      required: false,
      type: String,
    }
  },
  { collection: process.env.COLLECTION}
);

module.exports = mongoose.model("Customer", dataSchema);
