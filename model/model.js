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
    email: {
      required: false,
      type: String,
    },
    password: {
      required: false,
      type: String,
    }
  },
  { collection: "Customer" }
);

module.exports = mongoose.model("Customer", dataSchema);
