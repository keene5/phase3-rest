const express = require("express");
const validator = require("validator");

const router = express.Router();
const Model = require("../model/model.js");

const { models } = require("mongoose");

module.exports = router;

router.post("/addCustomer", async (req, res) => {
  const data = new Model({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const dataToSave = await data.save();
    res.status(201).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const data = await Model.find();
    if (data) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/getCustomer/:id", async (req, res) => {
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

router.put("/updateCustomer/:id", async (req, res) => {
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

router.delete("/deleteCustomer/:id", async (req, res) => {
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
