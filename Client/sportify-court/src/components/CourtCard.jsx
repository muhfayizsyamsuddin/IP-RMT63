import { Link } from "react-router";

export default function CourtCard({ court }) {
  return (
    <Link to={`/public/courts/${court.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-200 group-hover:border-blue-500">
        <img
          src={court.imageUrl}
          alt={court.name}
          onError={(e) =>
            (e.target.src = "https://placehold.co/300x200?text=No+Image")
          }
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-2xl border-b border-gray-200 shadow-sm hover:shadow-md hover:rounded-b-lg hover:border-blue-300 hover:shadow-blue-300/50 transition-all duration-300 rounded-t-2xl shadow-lg hover:shadow-xl hover:border-blue-400 hover:scale-105"
        />
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-200">
            {court.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5">
              {/* Location icon changed to a map pin */}
              <svg
                className="w-4 h-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1116 0c0 4.97-3.582 9-8 9zm0-11a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
            </span>
            {court.location}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-blue-600 font-bold text-lg">
              Rp {court.pricePerHour?.toLocaleString() ?? "N/A"}{" "}
              <span className="text-xs font-normal text-gray-500">/ jam</span>
            </span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
              Lihat Detail
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
