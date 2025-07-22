const express = require("express");
const router = express.Router();
const courtController = require("../controllers/courtController");

//* Public routes
router.get("/courts", courtController.findAll);
router.get("/courts/:id", courtController.findById);

module.exports = router;
