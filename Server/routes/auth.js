const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const errorHandler = require("../middleware/errorHandler");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/login/google", authController.googleLogin);

//* error handler
router.use(errorHandler);

module.exports = router;
