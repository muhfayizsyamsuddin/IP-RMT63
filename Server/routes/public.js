const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");
const errorHandler = require("../middleware/errorHandler");

//* Public routes
// GET semua lapangan (semua user bisa lihat)
router.get("/courts", publicController.getCourts);
// GET detail lapangan by id
router.get("/courts/:id", publicController.getCourtsById);

//* error handler
router.use(errorHandler);

module.exports = router;
