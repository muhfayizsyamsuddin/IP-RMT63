process.env.CALLBACK_TOKEN = "test-callback";
const request = require("supertest");
const app = require("../app"); // pastikan ini mengarah ke express instance kamu
const { sequelize, User, Court, Booking, Payment } = require("../models");
const { signToken } = require("../helpers/jwt");
require("dotenv").config({ path: ".env.test" });

jest.mock("midtrans-client", () => {
  return {
    Snap: jest.fn().mockImplementation(() => ({
      createTransaction: jest.fn().mockResolvedValue({
        token: "dummy-token",
        redirect_url: "https://midtrans.com/pay/123",
      }),
    })),
  };
});

let access_token;
let courtId, bookingId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    name: "Test User",
    email: "testuser@mail.com",
    password: "123456", // jika pakai hashing, pastikan cocok
  });

  access_token = signToken({ id: user.id, email: user.email, name: user.name });

  const court = await Court.create({
    name: "Lapangan A",
    location: "Jakarta",
    pricePerHour: 100000,
    category: "Futsal",
    description: "Lapangan futsal standar nasional",
    imageUrl: "https://via.placeholder.com/300",
  });
  courtId = court.id;

  const booking = await Booking.create({
    UserId: user.id,
    CourtId: court.id,
    date: "2025-07-30",
    timeStart: "08:00",
    timeEnd: "10:00",
    isPaid: true,
  });
  bookingId = booking.id;
});

afterAll(async () => {
  await sequelize.close();
});
describe("POST /payments", () => {
  it("should create a payment and return snapToken", async () => {
    const res = await request(app)
      .post("/payments")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        BookingId: bookingId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("snapToken", "dummy-token");

    const payment = await Payment.findOne({ where: { BookingId: bookingId } });
    expect(payment).toBeTruthy();
    expect(payment.amount).toBe(200000); // 2 jam x 100rb
    expect(payment.paymentUrl).toBe("https://midtrans.com/pay/123");
  });
});

describe("POST /payments/callback", () => {
  let orderId;

  beforeAll(async () => {
    // Buat Booking & Payment manual (tanpa Midtrans)
    const user = await User.findOne();
    const court = await Court.findOne();

    const booking = await Booking.create({
      UserId: user.id,
      CourtId: court.id,
      date: "2025-08-01",
      timeStart: "15:00",
      timeEnd: "17:00",
      isPaid: false,
    });

    orderId = `CALLBACK-${booking.id}-${Date.now()}`;
    await Payment.create({
      BookingId: booking.id,
      orderId,
      amount: 200000,
      status: "pending",
      paymentUrl: "https://dummy.url",
    });
  });

  it("should process Midtrans callback and mark payment as paid", async () => {
    const notifPayload = {
      order_id: orderId,
      transaction_status: "settlement", // atau "capture"
    };

    const res = await request(app)
      .post("/payments/callback")
      .send(JSON.stringify(notifPayload))
      .set("x-callback-token", "test-callback");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Callback received");

    const payment = await Payment.findOne({ where: { orderId } });
    expect(payment.status).toBe("paid");

    const booking = await Booking.findByPk(payment.BookingId);
    expect(booking.isPaid).toBe(true);
  });
});
describe("GET /payments/mine", () => {
  it("should return a list of my payments", async () => {
    const res = await request(app)
      .get("/payments/mine")
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const payment = res.body[0];
      expect(payment).toHaveProperty("id");
      expect(payment).toHaveProperty("amount");
      expect(payment).toHaveProperty("status");

      expect(payment.Booking).toBeDefined();
      expect(payment.Booking).toHaveProperty("id");
      expect(payment.Booking.Court).toBeDefined();
      expect(payment.Booking.Court).toHaveProperty("name");
    }
  });
  it("should return 401 if not authenticated", async () => {
    const res = await request(app).get("/payments/mine");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid token");
  });
  it("should return 401 if no token provided", async () => {
    const res = await request(app).get("/payments/mine");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid token");
  });
});
describe("PATCH /payments/:id", () => {
  it("should mark payment as paid", async () => {
    const user = await User.findOne();
    const court = await Court.findOne();

    const booking = await Booking.create({
      UserId: user.id,
      CourtId: court.id,
      date: "2025-08-05",
      timeStart: "09:00",
      timeEnd: "11:00",
      isPaid: false,
    });

    const payment = await Payment.create({
      BookingId: booking.id,
      orderId: `MANUAL-${booking.id}`,
      amount: 200000,
      status: "pending",
      paymentUrl: "https://dummy.url",
    });

    const res = await request(app)
      .patch(`/payments/${payment.id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Payment marked as paid");

    const updated = await Payment.findByPk(payment.id);
    expect(updated.status).toBe("paid");
  });
  it("should return 404 if payment not found", async () => {
    const res = await request(app)
      .patch("/payments/99999")
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(404);
  });
  it("should return 401 if not authenticated", async () => {
    const res = await request(app).patch("/payments/99999");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid token");
  });
  it("should return 401 if no token provided", async () => {
    const res = await request(app).patch("/payments/99999");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid token");
  });
});
describe("GET /payments/:id", () => {
  it("should return payment details", async () => {
    const user = await User.findOne();
    const court = await Court.findOne();
    const booking = await Booking.create({
      UserId: user.id,
      CourtId: court.id,
      date: "2025-08-10",
      timeStart: "10:00",
      timeEnd: "12:00",
      isPaid: false,
    });
    const payment = await Payment.create({
      BookingId: booking.id,
      orderId: `DETAIL-${booking.id}`,
      amount: 200000,
      status: "pending",
      paymentUrl: "https://dummy.url",
    });
    const res = await request(app)
      .get(`/payments/${payment.id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", payment.id);
    expect(res.body).toHaveProperty("amount", payment.amount);
    expect(res.body).toHaveProperty("status", payment.status);
    expect(res.body).toHaveProperty("paymentUrl", payment.paymentUrl);
  });
  it("should return 404 if payment not found", async () => {
    const res = await request(app)
      .get("/payments/99999")
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(404);
  });
  it("should return 401 if not authenticated", async () => {
    const res = await request(app).get("/payments/99999");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid token");
  });
  it("should return 401 if no token provided", async () => {
    const res = await request(app).get("/payments/99999");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid token");
  });
  it("should return 403 if user does not have permission", async () => {
    const res = await request(app)
      .get("/payments/99999")
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message", "Forbidden");
  });
});
