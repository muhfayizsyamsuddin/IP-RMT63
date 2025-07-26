const request = require("supertest");
const app = require("../app");
const { sequelize, Court, User } = require("../models");
const { signToken } = require("../helpers/jwt");

let adminToken;
let courtId;

beforeAll(async () => {
  // Buat user admin (jika belum ada)
  const admin = await User.create({
    email: "admin@mail.com",
    password: "123456", // pastikan dihash jika pakai hook
    role: "admin",
  });

  adminToken = signToken({ id: admin.id, email: admin.email });

  // Buat data dummy untuk court
  const court = await Court.create({
    name: "Lapangan Futsal Senayan",
    location: "Jakarta",
    pricePerHour: 200000,
    category: "Futsal",
    description: "Lapangan futsal indoor dengan rumput sintetis",
    imageUrl: "https://example.com/futsal.jpg",
  });

  courtId = court.id;
});

afterAll(async () => {
  await Court.destroy({ where: {} });
  await User.destroy({ where: {} });
  await sequelize.close();
});

describe("Court Endpoints", () => {
  describe("GET /courts", () => {
    it("should return list of courts", async () => {
      const res = await request(app)
        .get("/courts")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /courts/:id", () => {
    it("should return detail of a court", async () => {
      const res = await request(app)
        .get(`/courts/${courtId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id", courtId);
    });
  });

  describe("POST /courts", () => {
    it("should create a new court", async () => {
      const res = await request(app)
        .post("/courts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Lapangan Basket BSD",
          location: "Tangerang",
          category: "Futsal",
          pricePerHour: 150000,
          description: "Lapangan basket outdoor luas",
          imageUrl: "https://example.com/basket.jpg",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
    });
  });

  describe("PUT /courts/:id", () => {
    it("should update court data", async () => {
      const res = await request(app)
        .put(`/courts/${courtId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Lapangan Futsal Update",
          location: "Jakarta Selatan",
          category: "Futsal",
          pricePerHour: 250000,
          description: "Updated description",
          imageUrl: "https://example.com/updated.jpg",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Court updated successfully");
    });
  });

  describe("DELETE /courts/:id", () => {
    it("should delete court", async () => {
      const courtToDelete = await Court.create({
        name: "Lapangan Voli",
        location: "Bekasi",
        category: "Futsal",
        pricePerHour: 100000,
        description: "Lapangan voli indoor",
        imageUrl: "https://example.com/voli.jpg",
      });

      const res = await request(app)
        .delete(`/courts/${courtToDelete.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Court deleted successfully");
    });
  });
});
