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
        imageUrl:
          "https://images.unsplash.com/photo-1716745558902-c4d7a19a397d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGZ1dHNhbHxlbnwwfHwwfHx8MA%3D%3D",
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
        imageUrl:
          "https://images.unsplash.com/photo-1517747614396-d21a78b850e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWluaSUyMHNvY2NlcnxlbnwwfHwwfHx8MA%3D%3D",
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
          "https://images.unsplash.com/photo-1626926938421-90124a4b83fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGJhZG1pbnRvbnxlbnwwfHwwfHx8MA%3D%3D",
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
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBWtFeB-nqsRyFyeV8mLH8MScyK9K3d5G5MQ&s",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Stadion Tenis Rawamangun",
        category: "Tennis",
        location: "Jakarta Timur",
        pricePerHour: 120000,
        description:
          "Lapangan tenis dengan permukaan keras dan penerangan malam.",
        imageUrl:
          "https://images.unsplash.com/photo-1568478624365-1134fbd7c895?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA0fHx2b2xsZXl8ZW58MHx8MHx8fDA%3D",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Futsal Galaxy Arena",
        category: "Futsal",
        location: "Bekasi",
        pricePerHour: 130000,
        description: "Lapangan futsal dengan AC dan tribune penonton.",
        imageUrl:
          "https://images.unsplash.com/photo-1521217078329-f8fc1becab68?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnV0c2FsfGVufDB8fDB8fHww",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lapangan Basket Cibubur",
        category: "Basketball",
        location: "Jakarta Timur",
        pricePerHour: 100000,
        description: "Lapangan outdoor dengan lantai beton dan papan akrilik.",
        imageUrl:
          "https://images.unsplash.com/photo-1509027572446-af8401acfdc3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJhc2tldHxlbnwwfHwwfHx8MA%3D%3D",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lapangan Tennis Palembang",
        category: "Tennis",
        location: "Palembang",
        pricePerHour: 110000,
        description: "Tennis court clay dan hard court tersedia.",
        imageUrl:
          "https://images.unsplash.com/photo-1480180566821-a7d525cdfc5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRlbm5pc3xlbnwwfHwwfHx8MA%3D%3D",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lapangan Futsal Dago",
        category: "Futsal",
        location: "Bandung",
        pricePerHour: 140000,
        description: "Lapangan futsal indoor rumput sintetis.",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPXgPcFLGd2xqqrlYlXriV7JpHChaOFFaqZA&s",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lapangan Basket BSD",
        category: "Basketball",
        location: "Tangerang Selatan",
        pricePerHour: 125000,
        description: "Lapangan indoor dengan AC dan papan skor elektronik.",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIqF5EXjj-0_LYDLKe4np6ng3aLUeRzTdjZw&s",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "GOR Badminton Malang",
        category: "Badminton",
        location: "Malang",
        pricePerHour: 90000,
        description: "Lapangan karpet internasional dengan pencahayaan LED.",
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1663039984787-b11d7240f592?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGJhZG1pbnRvbnxlbnwwfHwwfHx8MA%3D%3D",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mini Soccer Taman Mini",
        category: "Mini Soccer",
        location: "Jakarta Timur",
        pricePerHour: 180000,
        description: "Mini soccer dengan ruang tunggu nyaman.",
        imageUrl:
          "https://images.unsplash.com/photo-1616778551732-6dd1289f567d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUzfHx2b2xsZXl8ZW58MHx8MHx8fDA%3D",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "GOR Volley Manado",
        category: "Volley",
        location: "Manado",
        pricePerHour: 95000,
        description: "Lapangan volley dengan tribun penonton.",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIgD47eHjui8wqalojPnP1opTWUZGMXF-9qg&s",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tennis Court Gading Serpong",
        category: "Tennis",
        location: "Tangerang",
        pricePerHour: 115000,
        description: "Court outdoor dengan pencahayaan LED.",
        imageUrl:
          "https://images.unsplash.com/photo-1499510318569-1a3d67dc3976?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGVubmlzfGVufDB8fDB8fHww",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lapangan Futsal Denpasar",
        category: "Futsal",
        location: "Denpasar",
        pricePerHour: 135000,
        description: "Futsal indoor dengan fasilitas shower dan parkir luas.",
        imageUrl:
          "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "GOR Badminton Makassar",
        category: "Badminton",
        location: "Makassar",
        pricePerHour: 95000,
        description: "4 lapangan dengan AC dan kantin.",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLX8-zLvd68YE_5CtHYSDTeD7h-V__WSPLBA&s",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lapangan Volley Yogyakarta",
        category: "Volley",
        location: "Yogyakarta",
        pricePerHour: 90000,
        description: "Volley court outdoor full pasir.",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrSvZy4uT_AlyGGzeoMGHpXRTZj87rCcbPIA&s",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Basket Court Tebet",
        category: "Basketball",
        location: "Jakarta Selatan",
        pricePerHour: 110000,
        description: "Lapangan semi indoor dengan papan skor digital.",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTytxjKVoYZbYCrkmjq6Ofd1VLR-XDLg6bPmA&s",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lapangan Tennis Bali",
        category: "Tennis",
        location: "Bali",
        pricePerHour: 130000,
        description: "Tennis court dengan pemandangan pantai.",
        imageUrl:
          "https://images.unsplash.com/photo-1620742820748-87c09249a72a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGVubmlzfGVufDB8fDB8fHww",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mini Soccer Ciputat",
        category: "Mini Soccer",
        location: "Tangerang Selatan",
        pricePerHour: 190000,
        description: "Mini soccer outdoor rumput sintetis dan cafetaria.",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjkN-zlIEkKExI00fk_0ZybZO1FoyErY1o9w&s",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Courts", null, {});
  },
};
