const { Payment, Booking, Court } = require("../models");
const midtransClient = require("midtrans-client");
const { signToken } = require("../helpers/jwt");
const { Op, or } = require("sequelize");
const dayjs = require("dayjs");
const axios = require("axios");

module.exports = class paymentController {
  static async initiateMidtransTrx(req, res, next) {
    try {
      console.log("Request Headers:", req.headers);
      console.log("Request Body:", req.body);

      if (!process.env.MIDTRANS_SERVER_KEY) {
        throw {
          name: "ServerError",
          message: "MIDTRANS_SERVER_KEY is missing",
        };
      }
      console.log("MIDTRANS_SERVER_KEY:", process.env.MIDTRANS_SERVER_KEY);
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
      });
      console.log("Request Body:", req.body);
      const { BookingId } = req.body;
      if (!BookingId) {
        throw { name: "InvalidInput", message: "BookingId is required" };
      }
      console.log("User ID:", req.user.id);
      console.log("Booking ID:", req.body.BookingId);
      if (!req.body.BookingId) {
        return res.status(400).json({ message: "BookingId is required" });
      }
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: user not found" });
      }
      // Cari booking berdasarkan BookingId dan UserId
      const booking = await Booking.findOne({
        where: {
          id: BookingId,
          UserId: req.user.id,
        },
      });

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const orderId = `BOOK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      if (!orderId) {
        return res.status(500).json({ message: "Order ID generation failed" });
      }
      const amount = 10000;
      let parameter = {
        // ini adalah data detail order
        transaction_details: {
          order_id: orderId,
          gross_amount: amount,
        },
        // ini adalah data jenis pembayaran
        credit_card: {
          secure: true,
        },
        // ini adalah data customer
        customer_details: {
          first_name: req.user.name,
          email: req.user.email,
        },
      };
      let transaction;
      try {
        // 1.create transaction to midtrans
        transaction = await snap.createTransaction(parameter);
        console.log("📦 Midtrans Transaction Response:", transaction);
        // transaction token
        if (!transaction.token) {
          throw new Error(
            "Transaction token is missing from Midtrans response"
          );
        }
        // console.log("transactionToken:", transactionToken);
      } catch (err) {
        console.error("Midtrans Error:", err.response?.data || err.message);
        throw err;
      }
      let transactionToken = transaction.token;
      // 2. create order in our database

      await Payment.create({
        BookingId: booking.id,
        amount,
        orderId,
      });

      res.json({ message: "Order created", transactionToken, orderId });
    } catch (err) {
      console.log("❌ INITIATE MIDTRANS TRX ERROR:");
      console.dir(err, { depth: null });
      next(err);
    }
  }

  static async upgradeAccount(req, res, next) {
    // check orderId, order ke midtrans, apakah sudah dibayar atau belum
    try {
      const { orderId } = req.body;

      // Cek apakah user sudah pernah upgrade
      const order = await Payment.findOne({
        where: {
          orderId,
        },
      });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      console.log("🔍 Order:", order);
      console.log("Headers:", req.headers);
      console.log("Authorization Header:", req.headers.authorization);

      if (order.status === "paid") {
        return res.status(400).json({ message: "Account already upgraded" });
      }

      const serverKey = process.env.MIDTRANS_SERVER_KEY;
      const base64ServerKey = Buffer.from(serverKey + ":").toString("base64");
      console.log(`Authorization: Basic ${base64ServerKey}`);
      const { data } = await axios.get(
        `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
        {
          headers: {
            Authorization: `Basic ${base64ServerKey}`,
          },
        }
      );
      console.log("📦 Midtrans Response:", data);
      // midtrans validasi status pembayaran
      if (data.transaction_status === "capture" && data.status_code === "200") {
        // Update status pembayaran di database
        await order.update({
          status: "paid",
          paidAt: new Date(),
        });
        res.status(200).json({ message: "Account upgraded successfully" });
      } else {
        return res.status(400).json({
          message: "Payment not completed or invalid transaction status",
          midtransMessage: data.status_message,
        });
      }
    } catch (err) {
      next(err);
    }
  }
};
