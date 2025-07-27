"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Booking, { foreignKey: "BookingId" });
    }
  }
  Payment.init(
    {
      BookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "BookingId is required" },
          isInt: { msg: "BookingId must be an integer" },
        },
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Amount is required" },
          min: { args: [1], msg: "Amount must be at least 1" },
          isInt: { msg: "Amount must be a number" },
        },
      },
      method: {
        type: DataTypes.STRING,
        defaultValue: "midtrans",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: {
            args: [["unpaid", "pending", "paid", "failed"]],
            msg: "Status must be one of: unpaid, pending, paid, failed",
          },
        },
      },
      paymentUrl: {
        type: DataTypes.STRING,
        validate: {
          isUrl: { msg: "paymentUrl must be a valid URL" },
        },
      },
      paidAt: {
        type: DataTypes.DATE,
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "OrderId is required",
          },
          notEmpty: {
            msg: "OrderId cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
