// __tests__/recommend.test.js atau tests/recommend.test.js
const request = require("supertest");
const express = require("express");
const recommendRoute = require("../routes/ai");

// 🧪 Mock askGemini
jest.mock("../helpers/AskGemini", () => ({
  askGemini: jest.fn(),
}));

const { askGemini } = require("../helpers/AskGemini");

// 🔧 Setup express app for testing
const app = express();
app.use(express.json());
app.use("/", recommendRoute);

describe("POST /recommend", () => {
  it("should return recommendation from Gemini", async () => {
    askGemini.mockResolvedValueOnce("Rekomendasi terbaik: 18:00 - 19:00");

    const res = await request(app)
      .post("/recommend")
      .send({
        availableSlots: ["17:00 - 18:00", "18:00 - 19:00", "20:00 - 21:00"],
        preference: "lebih suka sore hari setelah jam kerja",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "recommendation",
      "Rekomendasi terbaik: 18:00 - 19:00"
    );
    expect(askGemini).toHaveBeenCalledWith(
      expect.stringContaining("lebih suka sore hari setelah jam kerja")
    );
  });

  it("should return 500 if askGemini throws error", async () => {
    askGemini.mockRejectedValueOnce(new Error("Gemini Error"));

    const res = await request(app)
      .post("/recommend")
      .send({
        availableSlots: ["17:00 - 18:00"],
        preference: "sore hari",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message"); // tergantung error handler kamu
  });
});
