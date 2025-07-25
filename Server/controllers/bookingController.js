const { Booking, Court, User, Payment } = require("../models");

module.exports = class bookingController {
  //* Buat Booking (user)
  static async getMyBookings(req, res, next) {
    try {
      const userId = req.user.id;
      console.log("🚀 ~ getMyBookings ~ userId:", userId);
      const bookings = await Booking.findAll({
        where: { UserId: userId },
        include: [
          Court,
          {
            model: Payment,
            attributes: ["status", "paidAt"],
            required: false,
          },
        ],
      });
      res.status(200).json(bookings);
    } catch (err) {
      console.log("🚀 ~ getMyBookings ~ err:", err);
      next(err);
    }
  }
  //* Ambil semua booking (admin)
  static async getAllBookings(req, res, next) {
    try {
      const { status } = req.query;

      const options = {
        include: [
          { model: Court },
          {
            model: User,
            attributes: ["id", "email", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      };

      // Tambahkan filter jika ada query status
      if (status) {
        options.where = { status };
        console.log("🚀 ~ getAllBookings ~ options:", options);
      }

      const bookings = await Booking.findAll(options);
      res.status(200).json(bookings);
    } catch (err) {
      next(err); // pastikan error dikirim ke error handler
    }
  }
  //* Create Booking (user)
  static async createBooking(req, res, next) {
    try {
      const userId = req.user.id;
      const { CourtId, date, timeStart, timeEnd } = req.body;
      const booking = await Booking.create({
        CourtId,
        UserId: userId,
        date,
        timeStart,
        timeEnd,
      });
      res.status(201).json({ message: "Booking created", booking });
    } catch (err) {
      next(err);
    }
  }
  //* Update Booking (admin)
  static async updateBooking(req, res, next) {
    try {
      const { id } = req.params;
      const { date, timeStart, timeEnd, status } = req.body;
      const booking = await Booking.findByPk(id);
      if (!booking) throw { name: "NotFound", message: "Booking not found" };
      //* Validasi hanya boleh update booking dengan status pending
      if (booking.status !== "pending") {
        throw {
          name: "Forbidden",
          message: "Only bookings with status 'pending' can be updated",
        };
      }
      //* Update hanya field tertentu
      await booking.update({
        date: date || booking.date,
        timeStart: timeStart || booking.timeStart,
        timeEnd: timeEnd || booking.timeEnd,
        status: status || booking.status,
      });

      res.status(200).json({ message: "Booking updated" });
    } catch (err) {
      next(err);
    }
  }
  //* Update Booking Status (admin)
  static async updateBookingStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const booking = await Booking.findByPk(id);
      if (!booking) throw { name: "NotFound", message: "Booking not found" };

      // Validasi status (opsional, hanya allow certain status)
      const validStatuses = ["pending", "approved", "cancelled"];
      if (!validStatuses.includes(status)) {
        throw { name: "BadRequest", message: "Invalid status value" };
      }

      await booking.update({ status });

      res.status(200).json({ message: "Booking status updated", booking });
    } catch (err) {
      next(err);
    }
  }
  //* Hapus Booking (admin)
  static async deleteBooking(req, res, next) {
    try {
      const { id } = req.params;
      const booking = await Booking.findByPk(id);
      if (!booking) throw { name: "NotFound", message: "Booking not found" };
      await booking.destroy();
      res.status(200).json({ message: "Booking deleted" });
    } catch (err) {
      next(err);
    }
  }
};
