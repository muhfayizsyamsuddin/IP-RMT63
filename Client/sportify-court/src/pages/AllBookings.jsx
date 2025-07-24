import { useEffect, useState } from "react";
import { api } from "../helpers/http-client";
import EditBookingModal from "../components/EditBookingModal";
import CancelModal from "../components/CancelModal";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const query = status ? `?status=${status}` : "";
      const response = await api.get(`/bookings${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🚀 ~ fetchBookings ~ response.data:", response.data);
      setBookings(response.data);
    } catch (err) {
      console.error("❌ Gagal ambil semua booking:", err);
    }
  };

  function handleCancelClick(id) {
    setSelectedBookingId(id);
    setShowCancelModal(true);
  }
  async function handleConfirmCancel() {
    try {
      await api.patch(`/bookings/${selectedBookingId}/status`, {
        status: "cancelled",
      });
      alert("Booking berhasil dibatalkan");
      setShowCancelModal(false);
      fetchBookings();
    } catch (err) {
      console.error("Gagal cancel:", err);
      alert("Gagal membatalkan booking");
    }
  }

  async function handleApprove(id) {
    try {
      await api.patch(`/bookings/${id}/status`, {
        status: "approved",
      });
      alert("Booking disetujui!");
      fetchBookings();
    } catch (err) {
      console.error("Gagal approve:", err);
      alert("Gagal menyetujui booking");
    }
  }
  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (updatedForm) => {
    try {
      const token = localStorage.getItem("access_token");
      await api.put(`/bookings/${selectedBooking.id}`, updatedForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Booking berhasil diupdate!");
      setShowEditModal(false);
      fetchBookings();
    } catch (err) {
      console.error("Gagal update booking:", err);
      alert("Gagal update booking");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white shadow rounded space-y-6 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8 bg-white shadow rounded space-y-6 text-gray-800">
        <h2 className="text-2xl font-bold mb-4">📋 Semua Booking</h2>
        <div className="flex justify-between items-center mb-4">
          <select
            className="border rounded px-4 py-2 w-full sm:w-auto text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {bookings.length === 0 ? (
          <p className="text-gray-500">Belum ada booking.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">User</th>
                <th className="p-2 border">Court</th>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Waktu</th>
                <th className="p-2 border">Pembayaran</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id} className="text-center">
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border">{b.User?.email}</td>
                  <td className="p-2 border">{b.Court?.name}</td>
                  <td className="p-2 border">
                    {new Date(b.date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-2 border">
                    {b.timeStart} - {b.timeEnd}
                  </td>
                  <td className="p-2 border">
                    {b.isPaid ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        Paid
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                        Belum Bayar
                      </span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <span
                      className={
                        b.status === "approved"
                          ? "text-green-600 font-semibold"
                          : b.status === "cancelled"
                          ? "text-red-600 font-semibold"
                          : "bg-yellow-100 text-yellow-600 text-xs font-medium px-2 py-1 rounded"
                      }
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-2 border flex justify-center items-center gap-2">
                    {b.status === "pending" && (
                      <button
                        onClick={() => openEditModal(b)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs mr-2"
                      >
                        Edit
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancelClick(b.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                      >
                        Cancel
                      </button>
                    )}
                    {b.status === "pending" && (
                      <button
                        onClick={() => handleApprove(b.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs mr-1"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {showEditModal && selectedBooking && (
          <EditBookingModal
            booking={selectedBooking}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEditSubmit}
          />
        )}
      </div>
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
