import { Link } from "react-router";

export default function CourtCard({ court }) {
  return (
    <Link to={`/public/courts/${court.id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100">
        <img
          src={court.imageUrl}
          alt={court.name}
          onError={(e) =>
            (e.target.src = "https://placehold.co/300x200?text=No+Image")
          }
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{court.name}</h3>
          <p className="text-sm text-gray-500">{court.location}</p>
          <p className="text-blue-600 font-bold mt-3">
            Rp {court.pricePerHour?.toLocaleString() ?? "N/A"} / jam
          </p>
        </div>
      </div>
    </Link>
  );
}
