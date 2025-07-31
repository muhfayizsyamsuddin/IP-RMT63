const express = require("express");
const router = require("express").Router();
const bookingController = require("../controllers/bookingController");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");
const errorHandler = require("../middleware/errorHandler");

router.use(authentication);
// USER
router.get("/mine", bookingController.getMyBookings);
router.post("/", bookingController.createBooking);
router.patch("/:id", bookingController.updateBooking); // Allow user to update their own booking

// ADMIN
router.get("/", isAdmin, bookingController.getAllBookings);
router.put("/:id", isAdmin, bookingController.updateBooking);
router.delete("/:id", isAdmin, bookingController.deleteBooking);
router.patch("/:id/status", isAdmin, bookingController.updateBookingStatus);

//* error handler
router.use(errorHandler);

module.exports = router;
