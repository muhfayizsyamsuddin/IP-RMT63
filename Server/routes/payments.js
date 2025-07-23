const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const paymentController = require("../controllers/paymentController");
const errorHandler = require("../middleware/errorHandler");

router.use(authentication);

router.post("/", paymentController.createPayment); // hanya user yang login
router.get("/mine", paymentController.getMyPayments);
router.put("/:id/mark-paid", paymentController.markAsPaid); // hanya untuk test manual

//* error handler
router.use(errorHandler);

module.exports = router;
