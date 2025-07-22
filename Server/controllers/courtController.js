const { Court } = require("../models");

module.exports = class courtController {
  static async getCourts(req, res, next) {
    try {
      console.log("FILTER CONDITIONS:", { where });
      const offset = (page - 1) * limit;
      const { rows, count } = await Court.findAndCountAll({
        where,
        limit: +limit,
        offset: +offset,
      });
      res.status(200).json({
        data: rows,
        pagination: {
          page: +page,
          totalPages: Math.ceil(count / limit),
          totalData: count,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCourtsById(req, res, next) {
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
