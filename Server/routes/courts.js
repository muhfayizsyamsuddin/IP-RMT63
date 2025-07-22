const express = require("express");
const router = express.Router();
const courtController = require("../controllers/courtController");
const authentication = require("../middlewares/authentication");
const guardAdmin = require("../middleware/guardAdmin");

// GET semua lapangan (semua user bisa lihat)
router.get("/", courtController.getCourts);

// GET detail lapangan by id
router.get("/:id", courtController.findById);

// Semua endpoint di sini harus login dulu
router.use(authentication); //*Semua route setelah ini butuh login

// POST buat tambah lapangan (hanya admin)
router.post("/", guardAdmin, courtController.create);

// PUT edit lapangan (admin)
router.put("/:id", guardAdmin, courtController.update);

// DELETE hapus lapangan (admin)
router.delete("/:id", guardAdmin, courtController.destroy);

module.exports = router;
