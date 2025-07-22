// app.js
const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth"); // nanti kita buat
const publicRoutes = require("./routes/public");
const courtRoutes = require("./routes/courts"); // nanti
// const bookingRoutes = require("./routes/bookings"); // nanti
// const paymentRoutes = require("./routes/payments"); // nanti
// const errorHandler = require("./middlewares/errorHandler"); // nanti

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/auth", authRoutes); // POST /auth/register, /login
app.use("/public", publicRoutes); // misal: /pub/courts

app.use("/courts", courtRoutes); // GET /courts
// app.use("/bookings", bookingRoutes);
// app.use("/payments", paymentRoutes);
// router.use(authentication); // Semua route setelah ini butuh login
// Error handler
// app.use(errorHandler);

module.exports = app;
