import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../helpers/http-client";
import axios from "axios";
import { ErrorAlert, SuccessAlert } from "../helpers/alert";

export default function BookingForm() {
  const { id } = useParams(); // court ID
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const [preference, setPreference] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Ambil detail lapangan berdasarkan ID
  useEffect(() => {
    async function fetchCourt() {
      try {
        const res = await api.get(`/public/courts/${id}`);
        setCourt(res.data);
        SuccessAlert("Court fetched successfully!");
      } catch (err) {
        console.error("Gagal fetch court:", err);
        const errors =
          err.response?.data?.message || err.message || "Something went wrong!";
        ErrorAlert(errors, "Fetch Court Failed");
      }
    }
    fetchCourt();
  }, [id]);

  async function handleRecommendation() {
    setLoadingAi(true);
    console.log("🧠 AI Recommendation: Memulai permintaan ke backend...");
    try {
      const response = await axios.post("http://localhost:3000/ai/recommend", {
        courtId: id,
        preference,
        availableSlots: [
          "2025-07-25 07:00 - 08:00",
          "2025-07-25 16:00 - 17:00",
          "2025-07-26 09:00 - 10:00",
        ],
      });
      console.log("📦 Rekomendasi dari AI:", response.data);
      console.log("📩 Text rekomendasi:", response.data.recommendation);
      // setRecommendation("Saran: Booking jam 7 pagi atau jam 4 sore.");
      setRecommendation(response.data.recommendation || "Tidak ada hasil.");
      SuccessAlert("Rekomendasi AI berhasil!");
    } catch (err) {
      console.error(err);
      const errors =
        err.response?.data?.message || err.message || "Something went wrong!";
      ErrorAlert(errors, "Fetch Courts Failed");
    } finally {
      setLoadingAi(false);
    }
  }

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
      SuccessAlert("Booking berhasil!");
      navigate("/bookings/mine");
    } catch (err) {
      console.error("❌ Gagal booking:", err);
      const errors =
        err.response?.data?.message || err.message || "Something went wrong!";
      ErrorAlert(errors, "Booking Failed");
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
        <hr className="my-4" />

        {/* AI Recommendation Section */}
        <div className="space-y-2">
          <label>Preferensi Booking</label>
          <input
            type="text"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            placeholder="Contoh: pagi hari, cuaca cerah"
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={handleRecommendation}
            disabled={loadingAi}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow w-full"
          >
            {loadingAi ? "Memproses..." : "Rekomendasikan Waktu Booking (AI)"}
          </button>

          {recommendation && (
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded shadow">
              <strong>Rekomendasi AI:</strong> {recommendation}
            </div>
          )}
        </div>
        {loadingAi && <p className="text-muted">Sedang memproses AI...</p>}
      </form>
    </div>
  );
}
