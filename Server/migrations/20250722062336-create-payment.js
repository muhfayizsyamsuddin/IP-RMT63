"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Bookings",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      method: {
        type: Sequelize.STRING,
        defaultValue: "midtrans",
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
      },
      paymentUrl: {
        type: Sequelize.STRING,
      },
      paidAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Payments");
  },
};
