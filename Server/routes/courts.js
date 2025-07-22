const express = require("express");
const router = express.Router();
const courtController = require("../controllers/courtController");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

// Semua endpoint di sini harus login dulu
router.use(authentication); //* Semua route setelah ini butuh login

// GET semua lapangan (semua user bisa lihat)
router.get("/", isAdmin, courtController.getAllCourts);

// GET detail lapangan by id
router.get("/:id", isAdmin, courtController.getCourtById);

// POST buat tambah lapangan (hanya admin)
router.post("/", isAdmin, courtController.createCourt);

// PUT edit lapangan (admin)
router.put("/:id", isAdmin, courtController.updateCourt);

// DELETE hapus lapangan (admin)
router.delete("/:id", isAdmin, courtController.deleteCourt);

module.exports = router;
