// src/components/BookingForm.jsx
import { useState } from "react";
// import axios from "axios";
import { api } from "../helpers/http-client";

export default function BookingForm({ courtId }) {
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [preference, setPreference] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await api.post(
        "/bookings",
        {
          CourtId: courtId,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Booking berhasil!");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal booking. Coba lagi.");
    }
  }

  async function handleRecommendation() {
    setLoading(true);
    console.log("🧠 AI Recommendation: Memulai permintaan ke backend...");
    try {
      const response = await api.post("/ai/recommend", {
        courtId,
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
    } catch (err) {
      console.error(err);
      alert("❌ Gagal mendapatkan rekomendasi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
      <h4 className="mb-3">Booking Lapangan</h4>

      <div className="mb-3">
        <label className="form-label">Tanggal</label>
        <input
          type="date"
          name="date"
          className="form-control"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Jam Mulai</label>
        <input
          type="time"
          name="startTime"
          className="form-control"
          value={form.startTime}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Jam Selesai</label>
        <input
          type="time"
          name="endTime"
          className="form-control"
          value={form.endTime}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Booking Sekarang
      </button>
      <hr className="my-4" />

      {/* AI Recommendation Section */}
      <div className="space-y-2">
        <label>Preferensi Booking (opsional)</label>
        <input
          type="text"
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          placeholder="Contoh: pagi hari, cuaca cerah"
          className="form-control"
        />
        <button
          type="button"
          className="btn btn-success w-100"
          onClick={handleRecommendation}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Rekomendasikan Waktu Booking (AI)"}
        </button>

        {recommendation && (
          <div className="alert alert-info mt-3">
            <strong>Rekomendasi:</strong> {recommendation}
          </div>
        )}
      </div>
      {loading && <p className="text-muted">Sedang memproses AI...</p>}
      <p className="text-sm text-muted">Debug: {recommendation}</p>
    </form>
  );
}
