const express = require("express");
const { askGemini } = require("../helpers/AskGemini");

const router = express.Router();

router.post("/recommend", async (req, res, next) => {
  try {
    const { availableSlots, preference } = req.body;
    const prompt = `Berikan rekomendasi waktu terbaik untuk booking berdasarkan preferensi berikut: ${preference}. Pilihan slot tersedia: ${availableSlots.join(
      ", "
    )}`;

    const recommendation = await askGemini(prompt);
    res.json({ recommendation });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
