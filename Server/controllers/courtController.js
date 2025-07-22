const { Court } = require("../models");

module.exports = class courtController {
  static async getAllCourts(req, res, next) {
    try {
      const { order = "DESC" } = req.query;

      const courts = await Court.findAll({
        order: [["updatedAt", order.toUpperCase()]], // ASC / DESC
      });
      res.status(200).json(courts);
    } catch (err) {
      next(err);
    }
  }

  static async getCourtById(req, res, next) {
    try {
      const courtId = req.params.id;
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw { name: "NotFound", message: "Court not found" };
      }
      res.status(200).json(court);
    } catch (err) {
      next(err);
    }
  }

  static async createCourt(req, res, next) {
    try {
      const { name, category, location, pricePerHour, description, imageUrl } =
        req.body;
      const newCourt = await Court.create({
        name,
        category,
        location,
        pricePerHour,
        description,
        imageUrl,
      });
      res.status(201).json(newCourt);
    } catch (err) {
      next(err);
    }
  }

  static async updateCourt(req, res, next) {
    try {
      const courtId = req.params.id;
      const { name, category, location, pricePerHour, description, imageUrl } =
        req.body;
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw { name: "NotFound", message: "Court not found" };
      }
      await court.update({
        name,
        category,
        location,
        pricePerHour,
        description,
        imageUrl,
      });
      res.status(200).json({ message: "Court updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteCourt(req, res, next) {
    try {
      const courtId = req.params.id;
      const court = await Court.findByPk(courtId);
      if (!court) {
        throw { name: "NotFound", message: "Court not found" };
      }
      await court.destroy();
      res.status(200).json({ message: "Court deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
};
