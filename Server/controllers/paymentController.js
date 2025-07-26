const { Payment, Booking, Court } = require("../models");
const midtransClient = require("midtrans-client");
const { signToken } = require("../helpers/jwt");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

module.exports = class paymentController {
  static async createPayment(req, res, next) {
    try {
      const { BookingId } = req.body;
      console.log("🚀 ~ createPayment ~ BookingId:", BookingId);

      const booking = await Booking.findOne({
        where: {
          id: BookingId,
          UserId: req.user.id,
        },
        include: Court,
      });

      console.log("🔍 Booking:", booking);
      if (!booking) throw { name: "NotFound", message: "Booking not found" };

      const [startH, startM] = booking.timeStart.split(":").map(Number);
      const [endH, endM] = booking.timeEnd.split(":").map(Number);
      let baseDate = new Date(booking.date);
      let start = new Date(baseDate);
      start.setHours(startH, startM, 0, 0);

      let end = new Date(baseDate);
      end.setHours(endH, endM, 0, 0);

      // Jika lintas hari
      if (end <= start) {
        end.setDate(end.getDate() + 1);
      }

      const durationInMinutes = (end - start) / 60000;
      const durationInHours = durationInMinutes / 60;

      // Hitung total harga
      const amount = Math.ceil(durationInHours * booking.Court.pricePerHour);
      console.log("💰 Final amount:", amount);
      if (!amount || isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount for payment");
      }
      console.log("🔐 Server Key:", process.env.MIDTRANS_SERVER_KEY);
      if (!process.env.MIDTRANS_SERVER_KEY) {
        throw new Error("MIDTRANS_SERVER_KEY is missing");
      }
      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      // 👇 Buat orderId unik
      const orderId = `BOOKING-${booking.id}-${Date.now()}`;
      console.log("🆔 Order ID:", orderId);

      const parameter = {
        transaction_details: {
          order_id: orderId, // pakai orderId ini
          gross_amount: amount,
        },
        customer_details: {
          first_name: req.user.name || "Customer",
          email: req.user.email || "anonymous@sportify.com",
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
      console.log("🔑 MIDTRANS_SERVER_KEY:", process.env.MIDTRANS_SERVER_KEY);
      // const midtransRes = await snap.createTransaction(parameter);
      // console.log("📦 Midtrans Response:", midtransRes); // HARUS ADA redirect_url
      console.log("💰 Final amount:", amount);
      console.log("📤 Midtrans Params:", parameter);
      let midtransRes;
      try {
        console.log("🚀 Calling Midtrans Snap...");
        midtransRes = await snap.createTransaction(parameter);
        console.log("📦 Midtrans Response:", midtransRes);
      } catch (midErr) {
        console.log("❌ MIDTRANS ERROR:");
        console.log("MESSAGE:", midErr.message);
        console.log(
          "RESPONSE:",
          JSON.stringify(midErr.httpClientError, null, 2)
        );
        console.dir(midErr, { depth: null });
        return next(midErr);
      }
      // 👇 Simpan orderId juga
      const payment = await Payment.create({
        BookingId,
        amount,
        paymentUrl: midtransRes.redirect_url,
        orderId, // 👈 simpan orderId
      });

      console.log("✅ Payment saved to DB:", payment);
      res.status(201).json({ snapToken: midtransRes.token });
    } catch (err) {
      // console.log("🚀 ~ createPayment ~ err:", err);
      console.log("❌ CREATE PAYMENT ERROR:");
      console.dir(err, { depth: null });
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

  static async midtransCallback(req, res, next) {
    try {
      console.log("🔥 Midtrans Callback Body:", req.body);

      const notif = JSON.parse(req.body.toString());
      const orderId = notif.order_id;

      const payment = await Payment.findOne({ where: { orderId } });

      if (!payment) throw { name: "NotFound", message: "Payment not found" };

      if (
        notif.transaction_status === "settlement" ||
        notif.transaction_status === "capture"
      ) {
        payment.status = "paid";
        payment.paidAt = new Date();
        await payment.save();

        const booking = await Booking.findByPk(payment.BookingId);
        if (booking) {
          booking.isPaid = true;
          await booking.save();
        }
      }

      res.status(200).json({ message: "Callback received" });
    } catch (err) {
      console.log("❌ Callback Error:", err);

      next(err);
    }
  }
};
