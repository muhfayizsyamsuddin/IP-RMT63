// src/pages/PublicCourts.jsx
import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";
import { Link } from "react-router";
import CourtCard from "../components/CourtCard";
import Navbar from "../components/Navbar";

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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 mt-20">
        <h2 className="text-2xl font-bold mb-4">🏟️ Daftar Lapangan</h2>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Cari lapangan..."
            className="border rounded px-4 py-2 w-full sm:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-4 py-2 w-full sm:w-1/4"
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-4 py-2"
          >
            Cari
          </button>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-medium">
            Halaman {pagination.page} dari {pagination.totalPages || 1}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, pagination.totalPages || 1))
            }
            disabled={page === pagination.totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
