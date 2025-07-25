const request = require("supertest");
const app = require("../app");
const { sequelize, Court } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await Court.bulkCreate([
    {
      name: "Lapangan Futsal A",
      category: "futsal",
      location: "Jakarta",
      pricePerHour: 100000,
      description: "Lapangan futsal indoor",
      imageUrl: "https://dummyimage.com/futsalA",
    },
    {
      name: "Lapangan Basket B",
      category: "basket",
      location: "Bandung",
      pricePerHour: 120000,
      description: "Lapangan basket outdoor",
      imageUrl: "https://dummyimage.com/basketB",
    },
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe("Public Endpoints", () => {
  describe("GET /public/courts", () => {
    it("should return courts with pagination", async () => {
      const res = await request(app).get("/public/courts");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty("pagination");
    });

    it("should return courts filtered by category", async () => {
      const res = await request(app).get("/public/courts?category=basket");

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].category).toBe("basket");
    });

    it("should return courts filtered by search", async () => {
      const res = await request(app).get("/public/courts?search=jakarta");

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].location.toLowerCase()).toContain("jakarta");
    });
  });

  describe("GET /public/courts/:id", () => {
    it("should return detail of a specific court", async () => {
      const court = await Court.findOne();
      const res = await request(app).get(`/public/courts/${court.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("name", court.name);
    });

    it("should return 404 if court not found", async () => {
      const res = await request(app).get("/public/courts/9999");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Court not found");
    });
  });
});
