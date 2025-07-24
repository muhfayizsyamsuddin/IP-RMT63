"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: "UserId" });
      Booking.belongsTo(models.Court, { foreignKey: "CourtId" });
      Booking.hasOne(models.Payment, { foreignKey: "BookingId" });
    }
  }
  Booking.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      CourtId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: DataTypes.DATEONLY,
      timeStart: DataTypes.TIME,
      timeEnd: DataTypes.TIME,
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
