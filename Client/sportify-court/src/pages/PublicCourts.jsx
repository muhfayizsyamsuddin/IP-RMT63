// src/pages/PublicCourts.jsx
import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";
import { Link } from "react-router";
import CourtCard from "../components/CourtCard";
import Navbar from "../components/Navbar";
// import App from "./App.jsx";

export default function PublicCourts() {
  const [courts, setCourts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const fetchCourts = async () => {
    try {
      const response = await api.get("/public/courts", {
        params: {
          search,
          category,
          page,
          limit: 6, // tampilkan 6 per halaman
        },
      });
      setCourts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("❌ Gagal fetch courts:", err);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, [page, search, category]);

  const handleSearch = () => {
    setPage(1);
    fetchCourts();
  };

  const categories = [
    "Futsal",
    "Mini Soccer",
    "Badminton",
    "Basket",
    "Volley",
    "Tennis",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 pt-28">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
          🏟️ Daftar Lapangan
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 bg-white shadow-sm rounded-xl p-4 border border-blue-100">
          <input
            type="text"
            placeholder="Cari lapangan berdasarkan nama..."
            className="border border-blue-200 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-blue-200 rounded-lg px-4 py-2 w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2 transition shadow-sm"
          >
            Cari
          </button>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mt-12 text-gray-700 font-medium">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <span>
            Halaman <span className="font-bold">{pagination.page}</span> dari{" "}
            <span className="font-bold">{pagination.totalPages || 1}</span>
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, pagination.totalPages || 1))
            }
            disabled={page === pagination.totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
}
