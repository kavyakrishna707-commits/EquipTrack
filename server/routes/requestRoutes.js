const express = require("express");

const {
  createRequest,
  getRequests,
  getUserRequests,
  updateRequestStatus,
  returnEquipment
} = require("../controllers/requestController");

const router = express.Router();

router.post("/", createRequest);

// Get requests of a particular user
router.get("/user/:userId", getUserRequests);

// Get all requests for admin
router.get("/", getRequests);

// Approve or reject
router.put("/:id", updateRequestStatus);

// Return equipment
router.put("/:id/return", returnEquipment);

module.exports = router;