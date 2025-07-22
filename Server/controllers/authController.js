const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

module.exports = class authController {
  static async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      const newUser = await User.create({
        name,
        email,
        password,
        role: role || "user",
      });
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      if (!email) {
        throw { name: "BadRequest", message: "Email is required" }; //400
      }
      if (!password) {
        throw { name: "BadRequest", message: "Password is required" }; //400
      }
      const user = await User.findOne({ where: { email } });
      // console.log(user);
      if (!user) {
        throw {
          name: "Unauthorized",
          message: "Invalid email or password",
        };
      } // 401
      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw { name: "Unauthorized", message: "Invalid email or password" };
      } // 400
      const accessToken = signToken({ id: user.id });
      res.status(200).json({
        message: "Login Success",
        access_token: accessToken,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }
};
