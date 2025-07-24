import { Link } from "react-router";

export default function CourtCard({ court }) {
  return (
    <Link to={`/public/courts/${court.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
        <img
          src={court.imageUrl}
          alt={court.name}
          onError={(e) =>
            (e.target.src = "https://placehold.co/300x200?text=No+Image")
          }
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{court.name}</h3>
          <p className="text-sm text-gray-500">{court.location}</p>
          <p className="text-green-600 font-bold mt-2">
            Rp {court.pricePerHour?.toLocaleString() ?? "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
}
