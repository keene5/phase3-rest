const express = require("express");
const validator = require("validator");

const router = express.Router();
const Model = require("../model/model.js");
const User = require("../model/user.js");
const { v4: uuidv4 } = require("uuid");
const { encryptApiKey, decryptApiKey} = require("../security/encryption.js");

const { models } = require("mongoose");
const checkAccessLevel = require('../middleware/authenticate'); 

module.exports = router;

router.post("/addCustomer", checkAccessLevel(['admin', 'write']), async (req, res) => {
  const data = new Model({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    dateOfBirth: req.body.dateOfBirth,
    region: req.body.region,
  });

  try {
    const dataToSave = await data.save();
    res.status(201).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/getAll", checkAccessLevel(['admin', 'write', 'read']), async (req, res) => {
  try {
    const data = await Model.find();
    if (data) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getCustomer/:id", checkAccessLevel(['admin', 'write', 'read']), async (req, res) => {
  try {
    const data = await Model.findOne({ customerId: req.params.id });
    if (data) {
      return res.status(200).json(data);
    }
    return res.status(404).json({ message: "No Customer Found for that ID" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.put("/updateCustomer/:id", checkAccessLevel(['admin', 'write']), async (req, res) => {
  try {
    if (!validator.isUUID(req.params.id)) {
      return res.status(400).json({ message: "Invalid UUID format" });
    }
    const newCustomerData = req.body;
    const updatedCustomer = await Model.findOneAndUpdate(
      { customerId: req.params.id },
      newCustomerData,
      { new: true, runValidators: true, overwrite: true }
    );

    if (updatedCustomer) {
      return res.status(200).json(updatedCustomer);
    } else {
      return res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error while updating customer:", error);
    return res
      .status(500)
      .json({
        message: "An error occurred while trying to update the customer",
      });
  }
});

router.delete("/deleteCustomer/:id", checkAccessLevel(['admin', 'write']), async (req, res) => {
  try {
    const result = await Model.deleteOne({ customerId: req.params.id });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Customer deleted successfully" });
    } else if (result.deletedCount == 0) {
      {
        res.status(404).json({ message: "Customer not found" });
      }
    }
  } catch (error) {
    console.error("Error while deleting customer:", error); // Log error for debugging
    res
      .status(500)
      .json({
        message: "An error occurred while trying to delete the customer",
      });
  }
});


const resetData = [
  {
    customerId: "88c14e7e-3940-4d8b-a444-24f0b842b40d",
    name: "Donald Duck",
    dateOfBirth: "2020-01-01",
    region: 12,

    email: "duck@example.com",
    password: "password123"
  },
  {
    customerId: "591d5a16-8659-4ad3-8c49-73d4988576b9",
    name: "Bob WhatAbout",
    email: "bob@example.com",
    password: "password123"
  },
  {
    customerId: "b47655c3-0d58-4946-a200-4baaa1cc1e71",
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "password123"
  }
];


router.get("/resetCustomers", checkAccessLevel(['admin']), async (req, res) => {
  try {
    await Model.deleteMany({});
    await Model.insertMany(resetData);

    res.status(200).json({
        message: "Customer collection has been reset.",
        data: resetData
      });
  } catch (error) {
    console.error("Error while resetting customers:", error);
    res.status(500).json({ message: "An error occurred while resetting customers." });
  }
});
router.get('/customerFind', async (req, res) => {
  const { query } = req.query; 

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  let mongoQuery;
  
  try {
    mongoQuery = JSON.parse(query);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid query format' });
  }

  try {
    const customers = await Model.find(mongoQuery);

    if (customers.length === 0) {
      return res.status(404).json({ message: 'No records match your query' });
    }
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ message: 'An error occurred while executing the query.' });
  }
});

module.exports = router;

