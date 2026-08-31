const express = require("express");

const router = express.Router();

const {
  createRequest,
  getRequests,
  getUserRequests,
  updateRequestStatus,
  requestReturn,
  confirmReturn
} = require("../controllers/requestController");

router.post("/", createRequest);

router.get("/", getRequests);

router.get("/user/:userId", getUserRequests);

router.put("/:id/status", updateRequestStatus);

router.put("/:id/return", requestReturn);

router.put("/:id/confirm-return", confirmReturn);

module.exports = router;