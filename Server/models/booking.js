'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    userId: DataTypes.INTEGER,
    courtId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    timeStart: DataTypes.TIME,
    timeEnd: DataTypes.TIME,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};