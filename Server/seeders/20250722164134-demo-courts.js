"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Courts", [
      {
        name: "Lapangan Futsal Senayan",
        category: "Futsal",
        location: "Jakarta Selatan",
        pricePerHour: 150000,
        description: "Lapangan futsal indoor berstandar nasional.",
        imageUrl: "https://via.placeholder.com/300x200.png?text=Futsal+Senayan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mini Soccer Pondok Indah",
        category: "Mini Soccer",
        location: "Jakarta Selatan",
        pricePerHour: 200000,
        description:
          "Lapangan mini soccer rumput sintetis, cocok untuk 7 lawan 7.",
        imageUrl: "https://via.placeholder.com/300x200.png?text=Mini+Soccer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "GOR Badminton Cempaka",
        category: "Badminton",
        location: "Bandung",
        pricePerHour: 80000,
        description: "Tersedia 4 lapangan indoor dengan lantai karpet.",
        imageUrl:
          "https://via.placeholder.com/300x200.png?text=Badminton+Cempaka",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "GOR Volley Surabaya",
        category: "Volley",
        location: "Surabaya",
        pricePerHour: 100000,
        description:
          "Lapangan volley indoor full net, cocok untuk turnamen lokal.",
        imageUrl:
          "https://via.placeholder.com/300x200.png?text=Volley+Surabaya",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Courts", null, {});
  },
};
