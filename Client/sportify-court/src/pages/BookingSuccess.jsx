import { Link } from "react-router";

export default function BookingSuccess() {
  return (
    <div className="h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600">
          ✅ Pembayaran Berhasil!
        </h1>
        <p className="text-gray-700 mt-2">
          Terima kasih telah memesan lapangan di Sportify.
        </p>
        <Link
          to="/my-bookings"
          className="mt-6 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Lihat Booking Saya
        </Link>
      </div>
    </div>
  );
}
