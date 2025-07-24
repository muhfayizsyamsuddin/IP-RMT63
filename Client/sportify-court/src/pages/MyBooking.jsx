import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await api.get("/bookings/mine");
        setBookings(res.data);
      } catch (err) {
        console.error("❌ Gagal ambil data bookings:", err);
        alert(err.response?.data?.message || "Gagal ambil data");
      }
    }

    fetchBookings();
  }, []);

  async function handlePay(bookingId) {
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await api.post(
        "/payments",
        { BookingId: bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const snapUrl = data.payment.paymentUrl;
      window.open(snapUrl, "_blank"); // sementara pakai dummy payment URL
    } catch (err) {
      console.error("Gagal membuat payment:", err);
      alert("Gagal melakukan pembayaran"); // tampilkan pesan error
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">📋 Booking Saya</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">Belum ada booking.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="border rounded p-4 shadow bg-white space-y-2"
            >
              <h3 className="text-lg font-semibold">{b.Court.name}</h3>
              <p className="text-sm text-gray-600">{b.Court.location}</p>
              <p>
                <span className="font-medium">Tanggal:</span> {b.date}
              </p>
              <p>
                <span className="font-medium">Waktu:</span> {b.timeStart} -{" "}
                {b.timeEnd}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    b.status === "approved"
                      ? "text-green-600"
                      : b.status === "cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {b.status}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Pembayaran:</span>{" "}
                {b.Payment?.status === "paid" ? (
                  <span className="text-green-600 font-semibold">Paid</span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Belum Bayar
                  </span>
                )}
                {b.Payment?.status !== "paid" && (
                  <button
                    onClick={() => handlePay(b.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Bayar Sekarang
                  </button>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
