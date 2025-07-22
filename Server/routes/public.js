const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

//* Public routes
// GET semua lapangan (semua user bisa lihat)
router.get("/courts", publicController.getCourts);
// GET detail lapangan by id
router.get("/courts/:id", publicController.getCourtsById);

module.exports = router;
