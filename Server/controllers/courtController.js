const { Court } = require("../models");

module.exports = class courtController {
  static async getCourts(req, res, next) {
    try {
      const courts = await Court.findAll();
      res.status(200).json(courts);
    } catch (err) {
      next(err);
    }
  }

  static async findById(req, res, next) {
    try {
      const court = await Court.findByPk(req.params.id);
      if (!court) throw { name: "NotFound", message: "Court not found" };
      res.status(200).json(court);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
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

  static async update(req, res, next) {
    try {
      const { name, category, location, pricePerHour, description, imageUrl } =
        req.body;
      const court = await Court.findByPk(req.params.id);
      if (!court) throw { name: "NotFound", message: "Court not found" };

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

  static async destroy(req, res, next) {
    try {
      const court = await Court.findByPk(req.params.id);
      if (!court) throw { name: "NotFound", message: "Court not found" };

      await court.destroy();
      res.status(200).json({ message: "Court deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
};
