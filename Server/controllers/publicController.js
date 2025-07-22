const { Court } = require("../models");
const { Op } = require("sequelize");

module.exports = class publicController {
  static async getCourts(req, res, next) {
    try {
      const { search = "", category, page = 1, limit = 10 } = req.query;
      const where = {};
      // Search by name or location (case-insensitive)
      if (search && !category) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { location: { [Op.iLike]: `%${search}%` } },
        ];
      }
      // Filter by category
      if (category) {
        where.category = { [Op.iLike]: `%${category}%` };
      }
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
};
