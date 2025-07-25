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
        date: "2025-07-26",
        timeStart: "09:00",
        timeEnd: "11:00",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Booking created");
    expect(res.body.booking).toHaveProperty("id");
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
      .set("Authorization", `Bearer ${access_token}`)
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
});
describe("DELETE /bookings/:id", () => {
  it("should delete booking", async () => {
    const res = await request(app)
      .delete(`/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Booking deleted");
  });
});
