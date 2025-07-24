const { Payment, Booking, Court } = require("../models");

module.exports = class paymentController {
  static async createPayment(req, res, next) {
    try {
      const { BookingId } = req.body;

      const booking = await Booking.findByPk(BookingId, {
        include: Court,
      });
      if (!booking) throw { name: "NotFound", message: "Booking not found" };

      // Hitung amount berdasarkan harga court (atau static)
      const amount = 100000; // Bisa dinamis

      // Inisialisasi Midtrans Snap client
      let snap = new midtransClient.Snap({
        isProduction: false, // ganti ke true kalau production
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      const parameter = {
        transaction_details: {
          order_id: `BOOKING-${booking.id}-${Date.now()}`,
          gross_amount: amount,
        },
        customer_details: {
          first_name: req.user.name || "Customer",
          email: req.user.email,
        },
        item_details: [
          {
            id: booking.id,
            price: amount,
            quantity: 1,
            name: booking.Court.name,
          },
        ],
        credit_card: {
          secure: true,
        },
      };

      const midtransRes = await snap.createTransaction(parameter);

      const payment = await Payment.create({
        BookingId,
        amount,
        paymentUrl: midtransRes.redirect_url,
      });

      res.status(201).json({ message: "Payment created", payment });
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

      const payment = await Payment.findByPk(id, {
        include: Booking,
      });
      if (!payment) {
        throw { name: "NotFound", message: "Payment not found" };
      }

      // Tandai sebagai paid
      payment.status = "paid";
      payment.paidAt = new Date();
      await payment.save();

      // Update Booking.isPaid = true
      const booking = await Booking.findByPk(payment.BookingId);
      if (booking) {
        booking.isPaid = true;
        await booking.save();
      }

      res.status(200).json({ message: "Payment marked as paid", payment });
    } catch (err) {
      next(err);
    }
  }
};
