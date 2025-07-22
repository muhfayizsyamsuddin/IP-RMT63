"use strict";
// const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        name: "Admin Sportify",
        email: "admin@sportify.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Sportify",
        email: "user@sportify.com",
        password: hashedPassword,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
