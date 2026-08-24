const express = require("express");

const {
  getEquipment,
  addEquipment,
  updateEquipment,
  deleteEquipment
} = require("../controllers/equipmentController");

const router = express.Router();

// Get all equipment
router.get("/", getEquipment);

// Add equipment
router.post("/", addEquipment);

// Update equipment
router.put("/:id", updateEquipment);

// Delete equipment
router.delete("/:id", deleteEquipment);

module.exports = router;