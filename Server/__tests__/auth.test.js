jest.mock("google-auth-library", () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return {
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: () => ({
            name: "Test User",
            email: "test@example.com",
          }),
        }),
      };
    }),
  };
});
afterEach(() => {
  jest.restoreAllMocks();
});

const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.destroy({ where: {} }); // Clear User table to avoid unique constraint errors
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
    expect(res.body).toHaveProperty("message", "Email is required");
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
  test("should return 500 for server error", async () => {
    const spy = jest.spyOn(User, "findOne").mockImplementation(() => {
      throw new Error("Database error");
    });

    const res = await request(app).post("/auth/login").send({
      email: "test@mail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal Server Error");
    spy.mockRestore();
  });
  test("should return 400 for weak password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@mail.com",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Password must be at least 6 characters long"
    );
  });
  test("should return 400 for missing email", async () => {
    const res = await request(app).post("/auth/login").send({
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Email is required");
  });
  test("should return 400 for missing password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@mail.com",
      password: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Password is required");
  });
  test("should return 400 for empty email", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Email is required");
  });
  test("should return 400 for empty password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@mail.com",
      password: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Password is required");
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
    expect(res.body).toHaveProperty("message", "Name cannot be empty");
  });
  test("should return 400 for invalid email format", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Invalid Email",
      email: "invalid-email",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Validation isEmail on email failed"
    );
  });
  test("should return 400 for weak password", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Weak Password",
      email: "weakpassword@mail.com",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Password must be at least 6 characters long"
    );
  });
  test("should return 500 for server error", async () => {
    const spy = jest.spyOn(User, "create").mockImplementation(() => {
      throw new Error("Database error");
    });

    const res = await request(app).post("/auth/register").send({
      name: "Server Error",
      email: "servererror@mail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal Server Error");
    spy.mockRestore();
  });
  test("should return 400 for missing email", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Missing Email",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Email is required");
  });
  test("should return 400 for missing password", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Missing Password",
      email: "missingpassword@mail.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Password is required");
  });
  test("should return 400 for empty name", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "",
      email: "emptyname@mail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Name cannot be empty");
  });
  test("should return 400 for empty email", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Empty Email",
      email: "",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Validation isEmail on email failed"
    );
  });
  test("should return 400 for empty password", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Empty Password",
      email: "emptypassword@mail.com",
      password: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Password cannot be empty");
  });
  test("should return 400 for invalid password format", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Invalid Password Format",
      email: "invalidpasswordformat@mail.com",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Password must be at least 6 characters long"
    );
  });
});

describe("POST /auth/login/google", () => {
  test("should login with Google successfully", async () => {
    const res = await request(app).post("/auth/login/google").send({
      id_token: "valid-google-id-token",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("access_token");
  });
  test("should return 400 for missing id_token", async () => {
    const res = await request(app).post("/auth/login/google").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "id_token is required");
  });

  test("should return 500 for server error", async () => {
    const spy = jest.spyOn(User, "findOne").mockImplementation(() => {
      throw new Error("Database error");
    });

    const res = await request(app).post("/auth/login/google").send({
      id_token: "valid-google-id-token",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal Server Error");
    spy.mockRestore();
  });
});
