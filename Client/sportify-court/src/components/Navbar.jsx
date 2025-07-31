// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { SuccessAlert } from "../helpers/alert";
// import { api } from "../helpers/http-client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role"); // pastikan role disimpan di localStorage saat login
    const name = localStorage.getItem("name"); // ambil nama user dari localStorage
    setIsLoggedIn(!!token);
    setRole(userRole);
    setName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    setRole(null);
    setName("");
    SuccessAlert("Logout successful", "You have been logged out successfully.");
    navigate("/auth/login");
  };

  // const handleUpgrade = async () => {
  //   // Trigger snap popup. @TODO: Replace TRANSACTION_TOKEN_HERE with your transaction token
  //   try {
  //     const bookingRes = await api.get("/bookings/mine");
  //     const bookingId = bookingRes.data?.[0]?.id;

  //     if (!bookingId) {
  //       alert("You need to have a booking to upgrade!");
  //       return;
  //     }
  //     const { data } = await api.post("/payments/midtrans/initiate", {
  //       BookingId: bookingId,
  //     });
  //     window.snap.pay(data.transactionToken, {
  //       onSuccess: async function (result) {
  //         /* You may add your own implementation here */
  //         console.log("Payment Success:", result);
  //         await api.patch("/payments/me/upgrade", {
  //           orderId: data.orderId,
  //         });
  //         alert("Account upgraded successfully!");
  //       },
  //       onError: function (error) {
  //         console.error("Payment Error:", error);
  //         alert("Payment failed. Please try again.");
  //       },
  //     });
  //   } catch (err) {
  //     console.error("Upgrade Error:", err.response || err.message);
  //     alert("Failed to initiate upgrade. Please try again.");
  //   }
  // };

  const navItem = (label, path) => (
    <span
      onClick={() => navigate(path)}
      className="cursor-pointer text-gray-700 hover:text-blue-600"
    >
      {label}
    </span>
  );

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo & Welcome Section */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={"/Sportify-Courts.png"}
              alt="Sportify Logo"
              className="h-14 w-24 rounded-lg shadow-lg object-cover border border-blue-200 transition-transform hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/40?text=Logo";
              }}
            />
          </div>
          <div>
            <span className="text-gray-700 font-semibold text-base bg-gray-100 px-3 py-1 rounded-lg shadow-sm">
              {isLoggedIn ? `Welcome, ${name || "User"}` : "Welcome, Guest"}
            </span>
          </div>
        </div>
        <div className="hidden md:flex space-x-6 items-center font-medium text-gray-700">
          {navItem("Home", "/")}
          {navItem("Courts", "/")}
          {isLoggedIn && navItem("Booking History", "/bookings/mine")}
          {isLoggedIn &&
            role === "admin" &&
            navItem("Admin Panel", "/admin/bookings")}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
        {/* Mobile toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-2 text-gray-700 font-medium">
          {navItem("Home", "/")}
          {navItem("Courts", "/courts")}
          {isLoggedIn && navItem("Booking History", "/booking-history")}
          {isLoggedIn && role === "admin" && navItem("Admin Panel", "/admin")}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
