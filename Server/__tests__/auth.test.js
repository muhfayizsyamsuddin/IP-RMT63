const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.create({
    name: "Test User",
    email: "test@mail.com",
    password: "123456",
    role: "user",
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /auth/login", () => {
  test("should login successfully", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@mail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("access_token");
  });
});

describe("POST /auth/register", () => {
  test("should register new user", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Test Register",
      email: "reg@mail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("email", "reg@mail.com");
  });
});
describe("POST /auth/login with invalid credentials", () => {
  test("should return 401 for invalid credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "invalid@mail.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });
});
