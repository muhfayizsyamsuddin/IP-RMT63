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
    it("should return 200 with empty array if no courts", async () => {
      await Court.destroy({ where: {} }); // Hapus semua court

      const res = await request(app)
        .get("/courts")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get("/courts");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Authentication failed");
    });
    it("should return 403 if not admin", async () => {
      const user = await User.create({
        email: "user@mail.com",
        password: "123456",
        role: "user",
      });

      const userToken = signToken({ id: user.id, email: user.email });

      const res = await request(app)
        .get("/courts")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message", "Forbidden");
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

    it("should return 404 if court not found", async () => {
      const res = await request(app)
        .get("/courts/99999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Court not found");
    });
    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get(`/courts/${courtId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Authentication failed");
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
    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/courts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "",
          location: "Tangerang",
          pricePerHour: 150000,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Name and location are required"
      );
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
    it("should return 404 if court not found", async () => {
      const res = await request(app)
        .put("/courts/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Lapangan Tidak Ada",
          location: "Tidak Diketahui",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Court not found");
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
