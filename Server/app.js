console.log({ env: process.env.NODE_ENV });
if (process.env.NODE_ENV !== "production") {
  // hanya dipake ketika proses development
  // kalo production kita tidak menggunakan library dotenv -> env bawaan dari pm2 (runner)
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth"); // nanti kita buat
const publicRoutes = require("./routes/public");
const courtRoutes = require("./routes/courts"); // nanti
const bookingRoutes = require("./routes/bookings"); // nanti
const paymentRoutes = require("./routes/payments"); // nanti
// const errorHandler = require("./middleware/errorHandler"); // nanti
const aiRoutes = require("./routes/ai"); // untuk AI

app.use(cors());
app.use(express.urlencoded({ extended: false }));

// ⚠️ PENTING: PASANG RAW BODY HANYA UNTUK MIDTRANS CALLBACK
app.use(
  "/payments/midtrans/callback",
  express.raw({ type: "*/*" }) // Midtrans butuh raw body
);
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "its my life" });
// });

app.use(express.json());

// Routes
app.use("/auth", authRoutes); // POST /auth/register, /login
app.use("/public", publicRoutes);

app.use("/courts", courtRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/ai", aiRoutes);
// console.log("✅ /ai route berhasil dimount");
// router.use(authentication); // Semua route setelah ini butuh login
// Error handler
// app.use(errorHandler);

module.exports = app;
