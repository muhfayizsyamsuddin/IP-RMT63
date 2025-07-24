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
    </form>
  );
}
