// src/components/BookingForm.jsx
import { useState } from "react";
// import axios from "axios";
import { api } from "../helpers/http-client";
import { ErrorAlert, SuccessAlert } from "../helpers/alert";

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
      SuccessAlert("Bookings created successfully!");
    } catch (err) {
      console.error(err);
      const errors =
        err.response?.data?.message || err.message || "Something went wrong!";
      ErrorAlert(errors, "Create Booking Failed");
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
      const errors =
        err.response?.data?.message || err.message || "Something went wrong!";
      ErrorAlert(errors, "AI Recommendation Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-6 space-y-6"
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      <h4 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Booking Lapangan
      </h4>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tanggal
        </label>
        <input
          type="date"
          name="date"
          className="form-input w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jam Mulai
          </label>
          <input
            type="time"
            name="startTime"
            className="form-input w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jam Selesai
          </label>
          <input
            type="time"
            name="endTime"
            className="form-input w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.endTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-150"
      >
        Booking Sekarang
      </button>

      <hr className="my-6 border-gray-200" />

      {/* AI Recommendation Section */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Preferensi Booking <span className="text-gray-400">(opsional)</span>
        </label>
        <input
          type="text"
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          placeholder="Contoh: pagi hari, cuaca cerah"
          className="form-input w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="button"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-150"
          onClick={handleRecommendation}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Rekomendasikan Waktu Booking (AI)"}
        </button>

        {recommendation && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3 mt-2">
            <strong>Rekomendasi:</strong> {recommendation}
          </div>
        )}
      </div>
      {loading && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Sedang memproses AI...
        </p>
      )}
      <p className="text-xs text-gray-400 text-center mt-2">
        Debug: {recommendation}
      </p>
    </form>
  );
}
