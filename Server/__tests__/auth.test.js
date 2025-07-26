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
  test("should return 401 for invalid credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@mail.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });
  test("should return 400 for missing email or password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "",
      password: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Email and password are required"
    );
  });
  test("should return 400 for invalid email format", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "invalid-email",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid email format");
  });
  test("should return 404 for non-existing user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "nonexisting@mail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found");
  });
  test("should return 401 if no token provided", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@mail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Authentication failed");
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
  test("should return 400 for missing fields", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "",
      email: "",
      password: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Name, email, and password are required"
    );
  });
  test("should return 400 for invalid email format", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Invalid Email",
      email: "invalid-email",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid email format");
  });
  test("should return 400 for weak password", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Weak Password",
      email: "weakpassword@mail.com",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Password is too weak");
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
