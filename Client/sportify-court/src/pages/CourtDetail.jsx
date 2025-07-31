// src/pages/PublicCourtDetail.jsx
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";
import Navbar from "../components/Navbar";

export default function PublicCourtDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [court, setCourt] = useState(null);

  useEffect(() => {
    async function fetchCourt() {
      try {
        const res = await api.get(`/public/courts/${id}`);
        setCourt(res.data);
      } catch (err) {
        console.error("❌ Gagal fetch detail:", err);
      }
    }
    fetchCourt();
  }, [id]);

  if (!court) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto overflow-hidden">
          <img
            src={court.imageUrl}
            alt={court.name}
            onError={(e) =>
              (e.target.src = "https://placehold.co/600x300?text=No+Image")
            }
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {court.name}
            </h1>
            <p className="text-gray-500 text-sm mb-4">{court.location}</p>
            <p className="text-green-700 font-semibold text-xl mb-4">
              Rp {court.pricePerHour?.toLocaleString()}/jam
            </p>
            <p className="text-gray-700 mb-6">{court.description}</p>
            <button
              onClick={() => navigate(`/bookings/${court.id}`)}
              className="bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-semibold px-6 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
