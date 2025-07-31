// server.js
const cors = require("cors");
const app = require("./app");

app.use(
  cors({
    origin: "https://sportifycourts.web.app", // <- GANTI sesuai domain client kamu
    // credentials: true, // kalau pakai cookie auth (optional)
  })
);
console.log("NODE_ENV:", process.env.NODE_ENV);

require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
