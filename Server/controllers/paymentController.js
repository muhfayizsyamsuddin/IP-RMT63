const { Payment, Booking, Court } = require("../models");

module.exports = class paymentController {
  static async createPayment(req, res, next) {
    try {
      const { BookingId } = req.body;
      // Cari Booking dengan relasi Court
      const booking = await Booking.findByPk(BookingId, {
        include: Court,
      });
      if (!booking) {
        throw { name: "NotFound", message: "Booking not found" };
      }
      // Cek apakah sudah ada payment untuk booking ini
      const existing = await Payment.findOne({ where: { BookingId } });
      if (existing) {
        throw { name: "Forbidden", message: "Payment already exists" };
      }
      const amount = booking.Court?.pricePerHour;
      if (!amount)
        throw { name: "BadRequest", message: "Court price not found" };
      const newPayment = await Payment.create({
        BookingId,
        amount,
        method: "midtrans",
        status: "pending",
        paymentUrl: "https://dummy-payment.url.com", // nanti diganti dengan real Midtrans snap URL
      });

      res.status(201).json({ message: "Payment created", payment: newPayment });
    } catch (err) {
      next(err);
    }
  }

  static async getMyPayments(req, res, next) {
    try {
      const userId = req.user.id;

      const payments = await Payment.findAll({
        include: {
          model: Booking,
          where: { UserId: userId },
          include: Court,
        },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(payments);
    } catch (err) {
      next(err);
    }
  }

  static async markAsPaid(req, res, next) {
    try {
      const { id } = req.params;

      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw { name: "NotFound", message: "Payment not found" };
      }
      payment.status = "paid";
      payment.paidAt = new Date();

      await payment.save();

      res.status(200).json({ message: "Payment marked as paid", payment });
    } catch (err) {
      next(err);
    }
  }
};
