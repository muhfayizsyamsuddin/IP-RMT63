// src/components/EditBookingModal.jsx
import React, { useState, useEffect } from "react";

export default function EditBookingModal({ booking, onClose, onSubmit }) {
  const [form, setForm] = useState({
    date: "",
    timeStart: "",
    timeEnd: "",
  });

  useEffect(() => {
    if (booking) {
      setForm({
        date: booking.date,
        timeStart: booking.timeStart,
        timeEnd: booking.timeEnd,
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
        <h2 className="text-lg font-bold mb-4">✏️ Edit Booking</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Tanggal:
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </label>
          <label className="block mb-2">
            Waktu Mulai:
            <input
              type="time"
              name="timeStart"
              value={form.timeStart}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </label>
          <label className="block mb-2">
            Waktu Selesai:
            <input
              type="time"
              name="timeEnd"
              value={form.timeEnd}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </label>
          <div className="flex justify-end mt-4 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 bg-gray-400 text-white rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
