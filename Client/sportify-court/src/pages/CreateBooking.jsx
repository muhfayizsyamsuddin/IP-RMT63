import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../helpers/http-client";

export default function BookingForm() {
  const { id } = useParams(); // court ID
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [loading, setLoading] = useState(false);

  // Ambil detail lapangan berdasarkan ID
  useEffect(() => {
    async function fetchCourt() {
      try {
        const res = await api.get(`/public/courts/${id}`);
        setCourt(res.data);
      } catch (err) {
        console.error("Gagal fetch court:", err);
      }
    }
    fetchCourt();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/bookings", {
        CourtId: id,
        date,
        timeStart,
        timeEnd,
      });
      alert("Booking berhasil!");
      navigate("/bookings/mine");
    } catch (err) {
      console.error("❌ Gagal booking:", err);
      alert(err.response?.data?.message || "Booking gagal");
    } finally {
      setLoading(false);
    }
  };

  if (!court) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Booking: {court.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Tanggal</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Waktu Mulai</label>
          <input
            type="time"
            required
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Waktu Selesai</label>
          <input
            type="time"
            required
            value={timeEnd}
            onChange={(e) => setTimeEnd(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow w-full"
        >
          {loading ? "Memproses..." : "Booking Sekarang"}
        </button>
      </form>
    </div>
  );
}
