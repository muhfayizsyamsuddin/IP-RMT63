// src/pages/PublicCourtDetail.jsx
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img
        src={court.imageUrl}
        alt={court.name}
        onError={(e) =>
          (e.target.src = "https://placehold.co/600x300?text=No+Image")
        }
        className="w-full h-72 object-cover rounded shadow"
      />
      <div className="mt-6">
        <h1 className="text-3xl font-bold">{court.name}</h1>
        <p className="text-gray-600 text-sm">{court.location}</p>
        <p className="text-green-600 font-semibold text-xl mt-2">
          Rp {court.pricePerHour?.toLocaleString()}/jam
        </p>
        <p className="mt-4 text-gray-700 leading-relaxed">
          {court.description}
        </p>
        <button
          onClick={() => navigate(`/bookings/${court.id}`)}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
        >
          Booking
        </button>
      </div>
    </div>
  );
}
