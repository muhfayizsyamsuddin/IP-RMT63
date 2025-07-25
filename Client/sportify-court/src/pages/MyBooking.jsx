import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";
import { ErrorAlert, SuccessAlert } from "../helpers/alert";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      import.meta.env.VITE_MIDTRANS_CLIENT_KEY
    );
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const res = await api.get("/bookings/mine");
        setBookings(res.data);
        SuccessAlert("Bookings fetched successfully!");
      } catch (err) {
        console.error("❌ Gagal ambil data bookings:", err);
        const errors =
          err.response?.data?.message || err.message || "Something went wrong!";
        ErrorAlert(errors, "Fetch Booking Failed");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  async function handlePay(bookingId) {
    try {
      setPayingId(bookingId); // loading state
      const token = localStorage.getItem("access_token");

      const { data } = await api.post(
        "/payments",
        { BookingId: bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const snapToken = data.snapToken;

      // Pastikan Snap sudah dimuat
      if (!window.snap || !snapToken) {
        throw new Error("Snap belum dimuat atau token tidak tersedia");
      }

      // Jalankan pembayaran popup
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          SuccessAlert("Pembayaran berhasil!");
          setTimeout(() => window.location.reload(), 1000);
        },
        onPending: function (result) {
          SuccessAlert("Pembayaran menunggu konfirmasi.");
          setTimeout(() => window.location.reload(), 1000);
        },
        onError: function (err) {
          console.error(err);
          ErrorAlert("Pembayaran gagal.");
        },
        onClose: function () {
          ErrorAlert("Kamu membatalkan pembayaran.");
        },
      });
    } catch (err) {
      console.error("❌ Payment Error:", err);
      ErrorAlert("Gagal melakukan pembayaran. Payment Failed");
    } finally {
      setPayingId(null);
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  function formatTime(timeStr) {
    return timeStr.slice(0, 5); // contoh: "07:00:00" → "07:00"
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">📋 My Booking</h2>

      {loading ? (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Memuat booking...</span>
        </div>
      ) : bookings.length === 0 ? (
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
                <span className="font-medium">Tanggal:</span>{" "}
                {formatDate(b.date)}
              </p>
              <p>
                <span className="font-medium">Waktu:</span>{" "}
                {formatTime(b.timeStart)} - {formatTime(b.timeEnd)}
              </p>
              <p>
                <span className="font-medium">Status Booking:</span>{" "}
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                  {b.status}
                </span>
              </p>
              <div className="text-sm flex items-center gap-2">
                <span className="font-medium">Pembayaran:</span>{" "}
                {b.Payment?.status === "paid" ? (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                    Sudah Dibayar
                  </span>
                ) : (
                  <>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                      Belum Bayar
                    </span>
                    {b.status === "approved" && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => handlePay(b.id)}
                          disabled={
                            b.Payment?.status === "paid" || payingId === b.id
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {payingId === b.id
                            ? "Memproses..."
                            : "Bayar Sekarang"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
