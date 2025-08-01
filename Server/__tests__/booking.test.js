const request = require("supertest");
const app = require("../app");
const { sequelize, User, Court, Booking } = require("../models");
const { signToken } = require("../helpers/jwt");

let userToken, adminToken, courtId, bookingId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    name: "User Tester",
    email: "user@test.com",
    password: "123456",
    role: "user",
  });

  const admin = await User.create({
    name: "Admin Tester",
    email: "admin@test.com",
    password: "123456",
    role: "admin",
  });

  userToken = signToken({ id: user.id, email: user.email, role: user.role });
  adminToken = signToken({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });

  const court = await Court.create({
    name: "Lapangan Basket A",
    category: "basket",
    location: "Jakarta",
    pricePerHour: 100000,
    description: "Lapangan basket indoor",
    imageUrl: "https://dummyimage.com/basket",
  });

  courtId = court.id;
  const booking = await request(app)
    .post("/bookings")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      CourtId: courtId,
      date: "2025-07-26",
      timeStart: "09:00",
      timeEnd: "11:00",
    });

  bookingId = booking.body.booking.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /bookings", () => {
  it("should create a booking successfully", async () => {
    const res = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        CourtId: courtId,
        date: "2025-07-27", // Different date to avoid overlap
        timeStart: "09:00",
        timeEnd: "11:00",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Booking created");
    expect(res.body.booking).toHaveProperty("id");
  });
  it("should return 400 if booking time overlaps", async () => {
    const res = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        CourtId: courtId,
        date: "2025-07-26",
        timeStart: "10:00",
        timeEnd: "12:00",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Booking time overlaps with existing booking"
    );
  });
  it("should return 404 if court not found", async () => {
    const res = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        CourtId: 9999, // non-existent court
        date: "2025-07-26",
        timeStart: "09:00",
        timeEnd: "11:00",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Court not found");
  });
});

describe("GET /bookings/mine", () => {
  it("should return user’s own bookings", async () => {
    const res = await request(app)
      .get("/bookings/mine")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it("should return 401 if not authenticated", async () => {
    const res = await request(app).get("/bookings/mine");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid token");
  });
  it("should return 401 if no token provided", async () => {
    const res = await request(app).get("/bookings/mine");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid token");
  });
});

describe("PATCH /bookings/:id", () => {
  let bookingId;

  beforeAll(async () => {
    const user = await User.findOne();
    const court = await Court.findOne();

    const booking = await Booking.create({
      UserId: user.id,
      CourtId: court.id,
      date: "2025-08-05",
      timeStart: "08:00",
      timeEnd: "10:00",
    });
    bookingId = booking.id;
  });

  it("should update booking and return success", async () => {
    const res = await request(app)
      .patch(`/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        date: "2025-08-06",
        timeStart: "09:00",
        timeEnd: "11:00",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Booking updated");

    const updated = await Booking.findByPk(bookingId);
    expect(updated.date).toBe("2025-08-06");
  });
});

describe("PATCH /bookings/:id/status", () => {
  it("should update booking status to approved", async () => {
    const res = await request(app)
      .patch(`/bookings/${bookingId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "approved",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Booking status updated");
  });
  it("should return 403 if user tries to approve booking", async () => {
    const res = await request(app)
      .patch(`/bookings/${bookingId}/status`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        status: "approved",
      });
    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty(
      "message",
      "Only admin can access this resource"
    );
  });
  it("should return 404 if booking not found", async () => {
    const res = await request(app)
      .patch("/bookings/99999/status")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "approved",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Booking not found");
  });
});
describe("DELETE /bookings/:id", () => {
  it("should delete booking", async () => {
    const res = await request(app)
      .delete(`/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Booking deleted");
  });
  it("should return 404 if booking not found", async () => {
    const res = await request(app)
      .delete("/bookings/99999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Booking not found");
  });
});
