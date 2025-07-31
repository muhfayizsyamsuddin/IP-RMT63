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

jest.mock("axios", () => ({
  get: jest.fn().mockResolvedValue({
    data: {
      transaction_status: "capture",
      status_code: "200",
      status_message: "Success",
    },
  }),
}));

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

describe("Payment Endpoints", () => {
  describe("POST /payments/midtrans/initiate", () => {
    it("should initiate Midtrans transaction and return token", async () => {
      const res = await request(app)
        .post("/payments/midtrans/initiate")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          BookingId: bookingId,
          amount: 100000,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("transactionToken");
      expect(res.body).toHaveProperty("orderId");
      expect(res.body).toHaveProperty("message", "Order created");
    });
  });

  describe("PATCH /payments/me/upgrade", () => {
    it("should upgrade user account to premium", async () => {
      // First create a payment record with a mock orderId
      const payment = await Payment.create({
        BookingId: bookingId,
        amount: 10000,
        orderId: "MOCK-ORDER-123",
        status: "pending",
      });

      const res = await request(app)
        .patch("/payments/me/upgrade")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          orderId: payment.orderId,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Account upgraded successfully"
      );
    });
  });
});
