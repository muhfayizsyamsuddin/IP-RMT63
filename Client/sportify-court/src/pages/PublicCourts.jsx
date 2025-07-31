// src/pages/PublicCourts.jsx
import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";
import { Link } from "react-router";
import CourtCard from "../components/CourtCard";
import Navbar from "../components/Navbar";
// import { useSelector, } from "react-redux";
// import App from "./App.jsx";

export default function PublicCourts() {
  // const { courts } = useSelector((state) => state.court);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10 pt-32">
        <h2 className="text-4xl font-black text-blue-900 mb-10 flex items-center gap-4 drop-shadow-lg tracking-tight">
          <span className="text-5xl">🏟️</span> Daftar Lapangan
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 bg-white/90 shadow-xl rounded-xl p-4 border border-blue-200 backdrop-blur-lg">
          <div className="flex-1 flex flex-col gap-2">
            <label htmlFor="search" className="text-blue-900 font-semibold">
              Find a Court
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name & location..."
              className="border border-blue-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder-gray-400 shadow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex justify-center items-end pt-[33px]">
            <button
              onClick={handleSearch}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-100 disabled:opacity-40 transition-all shadow text-blue-700 font-semibold hover:text-blue-900 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 transition duration-200 ease-in-out hover:scale-105 transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white hover:shadow-lg transition-shadow duration-200 shadow-sm"
            >
              Search
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label htmlFor="category" className="text-blue-900 font-semibold">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-blue-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 shadow"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {courts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
        <div className="flex justify-center items-center gap-2 mt-16 text-gray-700 font-semibold">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-100 disabled:opacity-40 transition-all shadow"
            aria-label="First page"
          >
            <span>&laquo;</span>
          </button>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-100 disabled:opacity-40 transition-all shadow"
            aria-label="Previous page"
          >
            <span>&lsaquo;</span>
          </button>
          {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1)
            .filter(
              (num) =>
                num === 1 ||
                num === (pagination.totalPages || 1) ||
                (num >= page - 1 && num <= page + 1)
            )
            .map((num, idx, arr) => {
              if (idx > 0 && num !== arr[idx - 1] + 1) {
                return (
                  <span key={`ellipsis-${num}`} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-2 rounded-lg border transition-all shadow ${
                    num === page
                      ? "bg-blue-700 text-white border-blue-700 font-bold"
                      : "bg-white border-gray-300 hover:bg-blue-100"
                  }`}
                  aria-current={num === page ? "page" : undefined}
                >
                  {num}
                </button>
              );
            })}
          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, pagination.totalPages || 1))
            }
            disabled={page === pagination.totalPages}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-100 disabled:opacity-40 transition-all shadow"
            aria-label="Next page"
          >
            <span>&rsaquo;</span>
          </button>
          <button
            onClick={() => setPage(pagination.totalPages || 1)}
            disabled={page === pagination.totalPages}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-100 disabled:opacity-40 transition-all shadow"
            aria-label="Last page"
          >
            <span>&raquo;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
